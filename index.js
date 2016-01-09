var express = require('express');

var app = express();

app.set('port', process.env.EXPRESS_PORT || 3000);
app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Hello',
    message: 'world'
  });
});


app.listen(
  app.get('port'),
  function () {
    console.log('Example app listening on port '  + app.get('port'));
  }
);
