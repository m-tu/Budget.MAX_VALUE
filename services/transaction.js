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
      },
      include: [{
        model: models.File,
        as: 'files'
      }]
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
      return callback({
        message: result.errors
      });
    }

    result.data.UserId = user.id;
    models.Transaction.create(result.data).then(function(transaction) {
      var files = body.files;
      if (!files || files.length === 0) {
        return transaction;
      }

      return models.File.bulkCreate(files.map(function(file) {
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          data: new Buffer(file.data.split(',')[1], 'base64'),
          TransactionId: transaction.id
        };
      })).then(function() {
        return transaction;
      });
    }).then(function(transaction) {
      callback(null, transaction);
    }).catch(function(err) {
      callback({
        message: err
      });
    });
  }
};
