var express = require('express');

var app = express();

app.set('port', process.env.EXPRESS_PORT || 3000);

app.get('/', function (req, res) {
  res.json({
    hello: 'world'
  });
});


app.listen(
  app.get('port'),
  function () {
    console.log('Example app listening on port '  + app.get('port'));
  }
);
