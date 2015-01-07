var restify = require('restify');
var app = restify.createServer();

function respond(req, res, next) {
  res.send({hello: req.params.name});
  next();
}

app.get('/hello/:name', respond);

app.get(/\/.*/, restify.serveStatic({
  directory: __dirname + '/public',
  default: 'index.html'
}));

app.listen(8080, function() {
  console.log('Listening at ' + app.name);
});