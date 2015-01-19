'use strict';

var models  = require('../models');
var validateTransaction = require('../validators/transaction');

module.exports = {
  name: 'transaction',
  read: function (req, resource, params, config, callback) {
    var user = req.session.user;

    if (!user) {
      return callback(403);
    }

    models.Transaction.findAll({
      where: {
        UserId: user.id
      }
    }).then(function(transactions) {
      callback(null, transactions);
    });
  },
  create: function(req, resource, params, body, config, callback) {
    var user = req.session.user;

    if (!user) {
      return callback({
        statusCode: 403
      });
    }

    var result = validateTransaction(body);

    if (result.hasErrors) {
      callback({
        message: result.errors
      });
    } else {
      result.data.UserId = user.id;
      models.Transaction.create(result.data).complete(function(err, transaction) {
        if (err) {
          callback({
            message: err
          });
        } else {
          callback(null, transaction);
        }
      });
    }
  }
};
