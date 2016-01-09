// 3rd-party Libs
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');


var app = express();

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


app.get('/', function (req, res) {
  res.render('index');
});



app.listen(
  app.get('port'),
  function () {
    console.log('Consumer server listening on port '  + app.get('port'));
  }
);
