'use strict';

var models  = require('../models');

module.exports = function(app) {
  app.get('/api/auth/:name', function(req, res, next) {
    res.send({
      hello: req.params.name
    });

    next();
  });

  app.get('/api/users', function(req, res, next) {
    models.User.findAll().then(function(users) {
      res.send(users);
      next();
    });
  });
};