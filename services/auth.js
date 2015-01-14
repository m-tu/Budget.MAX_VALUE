'use strict';

var models  = require('../models');

module.exports = {
  name: 'auth',
  create: function (req, resource, params, body, config, callback) {
    models.User.find({
      where: {
        username: params.username,
        password: params.password
      },
      attributes: ['id', 'username']
    }).then(function(user) {
      if (user !== null) {
        req.session.user = user;
      }
      callback(null, user);
    });
  },
  delete: function(req, resource, params, config, callback) {
    req.session.user = null;
    callback(null);
  }
};
