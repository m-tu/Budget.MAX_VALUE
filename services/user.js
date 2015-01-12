'use strict';

var models  = require('../models');

module.exports = {
  name: 'user',
  read: function (req, resource, params, config, callback) {
    models.User.findAll().then(function(users) {
      callback(null, users);
    }, function() {
      callback('error');
    });
  }
};
