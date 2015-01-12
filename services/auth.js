'use strict';

var models  = require('../models');

module.exports = {
  name: 'auth',
  read: function (req, resource, params, config, callback) {
    models.User.findOne({
      where: {
        username: params.username,
        password: params.password
      }
    }).then(function(user) {
      callback(null, user);
    }, function() {
      callback('error');
    });
  }
};
