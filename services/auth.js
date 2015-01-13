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
      callback(null, user);
    });
  }
};
