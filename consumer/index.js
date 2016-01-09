// 3rd-party Libs
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;

var app = express();

// 21st century database
var users = {};

app.set('port', process.env.EXPRESS_PORT || 3001);
app.set('views', './views');
app.set('view engine', 'jade');

app.set('jwt-secret', process.env.JWT_SECRET || 'pc-load-letter');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'session-secret',
  resave: true,
  saveUninitialized: true
}));


// Session serializers
passport.serializeUser(
  function (user, done) {
    var key = user.email + '::' + user.iss;
    done(null, key);
  }
);

passport.deserializeUser(
  function (key, done) {
    var identifiers = key.split('::');
    var email = identifiers[0];
    var issuer = identifiers[1];
    var user = users[issuer][email]; // This object will always be populated
    done(null, user);
  }
);

var jwtOptions = {
  secretOrKey: app.get('jwt-secret')
};

passport.use(
  new JwtStrategy(
    jwtOptions,
    function (jwtPayload, done) {
      var email = jwtPayload.email;
      var issuer = jwtPayload.iss;

      // Create 'issuer' if it doesn't exist
      if (! (issuer in users)) {
        users[issuer] = {};
      }

      var issuerUsers = users[issuer];

      // If no user for email, create one!
      if (! (email in issuerUsers)) {
        issuerUsers[email] = jwtPayload
      }

      var user = issuerUsers[email];

      // Return the user!
      done(null, user);
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res, next) {
  if (req.user) {
      res.render('index', {
      user: req.user
    });
  } else { // Get JWT auth from authority server
    return res.redirect('http://localhost:3000/jwt-sso?returnTo=http://localhost:3001/');
  }
});


app.get('/access/jwt',
  function (req, res, next) {
    passport.authenticate('jwt',
      function (err, user, info) {
        if (err) {
          return next(err);
        }

        if (! user) { // failed to authenticate
          res.redirect('/jwtError');
        }

        // parse returnTo
        var redirectDest = '/';
        var returnTo = req.query.returnTo;
        if (returnTo !== undefined) {
          redirectDest = returnTo;
        }

        req.logIn(
          user,
          function (err) {
            if (err) {
              return next(err);
            }
            return res.redirect(redirectDest);
          }
        )

      }
    )(req, res, next);
  }
);

app.get('/jwtError', function (req, res) {
  res.render('message', {
    message: 'error authenticating with JTW'
  });
});



app.listen(
  app.get('port'),
  function () {
    console.log('Consumer server listening on port '  + app.get('port'));
  }
);
