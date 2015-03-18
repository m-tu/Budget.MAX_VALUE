'use strict';

import models from '../models';

export default {
  name: 'label',
  async read(req, resource, params, config, callback) {
    let user = req.session.user;

    if (!user) {
      return callback({
        statusCode: 403
      });
    }

    try {
      let label = await models.Label.findAll({
        where: {
          UserId: user.id
        }
      });
      callback(null, label);
    } catch (err) {
      callback(err);
    }
  },
  async update(req, resource, params, body, config, callback) {
    let user = req.session.user;

    if (!user) {
      return callback({
        statusCode: 403
      });
    }

    try {
      let label;
      if (params.id) {
        label = await models.Label.findOne({
          where: {
            id: params.id,
            UserId: user.id
          }
        });

        if (!label) {
          throw {
            statusCode: 404
          };
        } else {
          label = await label.updateAttributes(body);
        }
      } else {
        body.UserId = user.id;

        label = await models.Label.create(body);
      }

      callback(null, label);
    } catch (err) {
      callback(err);
    }
  },
  async delete(req, resource, params, config, callback) {
    let user = req.session.user;

    if (!user) {
      return callback({
        statusCode: 403
      });
    }

    try {
      let label = await models.Label.findOne({
        where: {
          id: params.id,
          UserId: user.id
        }
      });

      if (label) {
        await label.destroy();
      } else {
        throw {
          statusCode: 404
        };
      }

      callback(null, label.id);
    } catch (err) {
      callback(err);
    }
  }
};
