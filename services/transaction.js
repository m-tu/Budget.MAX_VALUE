'use strict';

import models from '../models';
import validateTransaction from '../validators/transaction';
import rp from 'request-promise';

// TODO test
async function saveFiles(transaction, files) {
  files = await* files.map((file) => {
      return rp({
        uri: file.thumnailLink,
        encoding: 'binary',
        auth: {
          bearer: body.accessToken
        },
        transform(body, response) {
          file.mimeType = response.headers['content-type'];
          file.data = new Buffer(body, 'binary');
        }
      });
  });

  await models.File.bulkCreate(files.map((file) => {
    return {
      googleDriveId: file.id,
      title: file.title,
      thumbnailData: file.data,
      thumbnailType: file.mimeType,
      embedLink: file.embedLink,
      imageUrl: file.imageUrl,
      TransactionId: transaction.id
    };
  }));

  // download thumbnails
  //return Promise.all(files.map(function(file) {
  //  return new Promise(function(resolve, reject) {
  //    request.get(file.thumbnailLink, {encoding: 'binary'}, function(err, response, body) {
  //      if (err) {
  //        return reject(err);
  //      }
  //
  //      file.mimeType = response.headers['content-type'];
  //      file.data = new Buffer(body, 'binary');
  //
  //      resolve(file);
  //    }).auth(null, null, true, body.accessToken);
  //  });
  //})).then(function(files) {
  //  return models.File.bulkCreate(files.map(function(file) {
  //    return {
  //      googleDriveId: file.id,
  //      title: file.title,
  //      thumbnailData: file.data,
  //      thumbnailType: file.mimeType,
  //      embedLink: file.embedLink,
  //      imageUrl: file.imageUrl,
  //      TransactionId: transaction.id
  //    };
  //  })).then(function() {
  //    return transaction;
  //  });
  //});
}

export default {
  name: 'transactions',
  async read(req, resource, params, config, callback) {
    let user = req.session.user;

    if (!user) {
      return callback(403);
    }

    try {
      let query = {
        where: {
          UserId: user.id
        },
        include: [{
          model: models.File,
          as: 'files'
        }, {
          model: models.LineItem,
          as: 'lineItems',
          include: [{
            model: models.Label,
            as: 'labels',
            attributes: ['id', 'name']
          }]
        }]
      };

      let result;
      if (params.id) {
        result = await models.Transaction.findOne(query);
      } else {
        result = await models.Transaction.findAll(query);
      }

      callback(null, result);
    } catch (err) {
      callback(err);
    }
  },
  async create(req, resource, params, body, config, callback) {
    let user = req.session.user;


    if (!user) {
      return callback({
        statusCode: 403
      });
    }

    try {
      let transaction;

      // load old transaction
      if (params.id) {
        transaction = await models.Transaction.findOne({
          where: {
            id: params.id,
            UserId: user.id
          }
        });

        if (!transaction) {
          throw {
            statusCode: 404
          };
        }
      }

      // validate transaction
      let result = validateTransaction(body);

      if (result.hasErrors) {
        throw {
          message: JSON.stringify(result)
        };
      }

      // create/update
      if (transaction) {
        transaction = await transaction.updateAttributes(result.data);
      } else {
        result.data.UserId = user.id;

        transaction = await models.Transaction.create(result.data);
        if (body.files && body.files.length > 0) {
          await saveFiles(transaction, body.files);
        }
      }

      // save line items
      if (body.lineItems) {
        // TODO validate
        for (let lineItem of body.lineItems) {
          lineItem.TransactionId = transaction.id;
        }

        await models.LineItem.bulkCreate(body.lineItems);
        let lineItems = await models.LineItem.findAll({
            where: {
              TransactionId: transaction.id
            },
            attributes: ['id']
          }, {raw: true});

        // yolo - hopefully IDS are in correct order
        let lineItemLabels = [];
        for (let [index, lineItem] of lineItems.entries()) {
          for (let labelId of body.lineItems[index].labels) {
            lineItemLabels.push({
              LineItemId: lineItem.id,
              LabelId: labelId
            });
          }
        }

        await models.LineItemLabels.bulkCreate(lineItemLabels);
      }

      callback(null, transaction);
    } catch (err) {
      console.log(err);
      callback(err);
    }

   /* var promise;

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
      if (body.lineItems) {
        // TODO validate
        body.lineItems.forEach(function(lineItem) {
          lineItem.TransactionId = transaction.id;
        });
        return models.LineItem.bulkCreate(body.lineItems).then(function() {
          return models.LineItem.findAll({
            where: {
              TransactionId: transaction.id
            },
            attributes: ['id']
          }, {raw: true});
        }).then(function(lineItems) {
          // yolo - hopefully IDS are in correct order
          var lineItemLabels = [];
          lineItems.forEach(function(lineItem, index) {
            body.lineItems[index].labels.forEach(function(labelId) {
              lineItemLabels.push({
                LineItemId: lineItem.id,
                LabelId: labelId
              });
            });
          });

          return models.LineItemLabels.bulkCreate(lineItemLabels);
        }).then(function() {
          return transaction;
        });
      } else {
        return transaction;
      }
    }).then(function(transaction) {
      callback(null, transaction);
      // TODO handle update fail
    }).catch(function(error) {
      callback(error);
    });*/
  }
};
