// 3rd-party Libs
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');

var uuid = require('node-uuid');
var jwt = require('jsonwebtoken');

// 21st century database
var users = require('./users.json');


var app = express();

app.set('port', process.env.EXPRESS_PORT || 3000);
app.set('views', './views');
app.set('view engine', 'jade');

app.set('my-domain', process.env.DOMAIN || 'example.com');
app.set('jwt-secret', process.env.JWT_SECRET || 'pc-load-letter');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'session-secret',
  resave: true,
  saveUninitialized: true
}));


// Passport

// Session serializers
passport.serializeUser(
  function (user, done) {
    done(null, user.id);
  }
);

passport.deserializeUser(
  function (id, done) {
    if (id in users.ids) {
      done(null, users.ids[id]);
    } else {
      done('No user with id ' + id);
    }
  }
);

// Local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function (username, password, done) {
      var userID = users.emails[username];
      if (userID !== undefined) {
        var user = users.ids[userID];
        if (user.password === password) {
          console.log('correct password, logged in');
          return done(null, user);
        } else {
          return done(null, false, { message: 'incorrect password' });
        }
      } else {
        return done(null, false, { message: 'incorrect username' });
      }
    }
  )
);


app.use(passport.initialize());
app.use(passport.session());


app.get('/', function (req, res) {
  res.render('index', {
    user: req.user,
    title: 'Hello',
    message: 'world'
  });
});

app.get('/sso', function (req, res) {
  res.render('login', {
    loginRoute: '/sso'
  });
});

app.post('/sso',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sso'
  })
);

app.get('/jwt-sso',
  function (req, res) {
    res.render('login', {
      loginRoute: '/jwt-sso'
    });
  }
);

app.post('/jwt-sso',
  function (req, res, next) {
    passport.authenticate('local',
      function (err, user, info) {
        if (err) {
          return next(err);
        }

        if (! user) { // failed to authenticate, try logging in again
          return res.redirect('/jwt-sso');
        }

        var jwtPayload = {
          email: user.email
          // Can add developer keys here
        };

        var jwtSecret = app.get('jwt-secret');

        var jwtOptions = {
          algorithm: 'HS256',
          jwtid: uuid.v4(),
          issuer: app.get('my-domain')
        };

        var token = jwt.sign(jwtPayload, jwtSecret, jwtOptions);
        console.log('Created JWT: ' + token);

        res.render('message', {
          message: 'JWT: ' + token
        });
      }
    )(req, res, next);
  }
);


app.listen(
  app.get('port'),
  function () {
    console.log('Authority server listening on port '  + app.get('port'));
  }
);
