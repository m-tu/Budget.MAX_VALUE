'use strict';

var restify = require('restify');
var app = restify.createServer();
var models = require('./models');

function respond(req, res, next) {
  res.send({hello: req.params.name});
  next();
}

// set routes
require('./routes')(app);

// set static html
app.get(/\/.*/, restify.serveStatic({
  directory: __dirname + '/public',
  default: 'index.html'
}));

// init db
models.sequelize.sync().then(function() {
  app.listen(8080, function() {
    console.log('Listening at ' + app.name + ' on port ' + 8080);
  });
});


