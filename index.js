// 3rd-party Libs
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');

// 21st century database
var users = require('./users.json');


var app = express();

app.set('port', process.env.EXPRESS_PORT || 3000);
app.set('views', './views');
app.set('view engine', 'jade');
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
    function (username, password, done) {
      var userID = users.usernames[username];
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

app.get('/login', function (req, res) {
  res.render('login');
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);


app.listen(
  app.get('port'),
  function () {
    console.log('Example app listening on port '  + app.get('port'));
  }
);
