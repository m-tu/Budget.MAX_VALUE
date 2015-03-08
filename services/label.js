'use strict';

import models from '../models';

export default {
  name: 'label',
  read: function (req, resource, params, config, callback) {
    var user = req.session.user;

    if (!user) {
      return callback(403);
    }

    models.Label.findAll({
      where: {
        UserId: user.id
      }
    }).then(function(label) {
      callback(null, label);
    });
  },
  update: function(req, resource, params, body, config, callback) {
    var user = req.session.user;

    if (!user) {
      return callback({
        statusCode: 403
      });
    }

    var promise;

    if (params.id) {
      promise = models.Label.findOne({
        where: {
          id: params.id,
          UserId: user.id
        }
      }).then(function(label) {
        if (!label) {
          return Promise.reject({
            statusCode: 404
          });
        } else {
          return label;
        }
      });
    } else {
      promise = Promise.resolve();
    }

    promise.then(function(label) {
      // TODO check unique name
      if (label) {
        return label.updateAttributes(body);
      } else {
        body.UserId = user.id;

        return models.Label.create(body);
      }
    }).then(function(label) {
      callback(null, label);
    }).catch(function(error) {
      callback(error);
    })
  },
  delete: function(req, resource, params, config, callback) {
    var user = req.session.user;

    if (!user) {
      return callback(403);
    }

    models.Label.findOne({
      where: {
        id: params.id,
        UserId: user.id
      }
    }).then(function(label) {
      if (!label) {
        return Promise.reject(404);
      } else {
        return label.destroy();
      }
    }).then(function() {
      callback(null, params.id);
    }, function(error) {
      callback(error);
    });
  }
};
