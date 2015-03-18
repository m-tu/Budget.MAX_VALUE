'use strict';

import models from '../models';

export default {
  name: 'auth',
  async create(req, resource, params, body, config, callback) {
    try {
      let user = await models.User.find({
        where: {
          username: params.username,
          password: params.password
        },
        attributes: ['id', 'username']
      });

      if (user !== null) {
        req.session.user = user;
      }

      callback(null, user);
    } catch (err) {
      callback(err);
    }
  },
  delete(req, resource, params, config, callback) {
    req.session.user = null;
    callback(null);
  }
};
