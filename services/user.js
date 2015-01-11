/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
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
