'use strict';

import models from '../models';

export default {
  name: 'user',
  async read(req, resource, params, config, callback) {
    try {
      let users = await models.User.findAll();
      callback(null, users);
    } catch (err) {
      callback(err);
    }
  }
};
