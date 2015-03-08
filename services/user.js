'use strict';

import models from '../models';

export default {
  name: 'user',
  read: function (req, resource, params, config, callback) {
    models.User.findAll().then(function(users) {
      callback(null, users);
    });
  }
};
