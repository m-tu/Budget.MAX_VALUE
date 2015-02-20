'use strict';

var models  = require('../models');
var validateTransaction = require('../validators/transaction');
var request = require('request');

function saveFiles(transaction, files) {
  if (!files || files.length === 0) {
    return Promise.resolve(transaction);
  }

  // download thumbnails
  return Promise.all(files.map(function(file) {
    return new Promise(function(resolve, reject) {
      request.get(file.thumbnailLink, {encoding: 'binary'}, function(err, response, body) {
        if (err) {
          return reject(err);
        }

        file.mimeType = response.headers['content-type'];
        file.data = new Buffer(body, 'binary');

        resolve(file);
      }).auth(null, null, true, body.accessToken);
    });
  })).then(function(files) {
    return models.File.bulkCreate(files.map(function(file) {
      return {
        googleDriveId: file.id,
        title: file.title,
        thumbnailData: file.data,
        thumbnailType: file.mimeType,
        embedLink: file.embedLink,
        imageUrl: file.imageUrl,
        TransactionId: transaction.id
      };
    })).then(function() {
      return transaction;
    });
  });
}

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

    var promise;

    if (params.id) {
      promise = models.Transaction.findOne({
        where: {
          id: params.id,
          UserId: user.id
        }
      }).then(function(transaction) {
        if (!transaction) {
          return Promise.reject({
            statusCode: 404
          });
        } else {
          return transaction;
        }
      });
    } else {
      promise = Promise.resolve();
    }

    promise.then(function(transaction) {
      var result = validateTransaction(body);

      if (result.hasErrors) {
        return Promise.reject({
          message: result.errors
        });
      }

      if (transaction) {
        // update
        return transaction.updateAttributes(result.data);
      } else {
        result.data.UserId = user.id;

        return models.Transaction.create(result.data).then(function(transaction) {
          return saveFiles(transaction, body.files);
        });
      }
    }).then(function(transaction) {
      callback(null, transaction);
      // TODO handle update fail
    }).catch(function(error) {
      callback(error);
    });
  }
};
