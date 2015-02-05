'use strict';

var navigateAction = require('flux-router-component').navigateAction;
var googleApiUtil = require('../utils/googleApi');

module.exports = function(context, transaction, done) {
  context.dispatch('CREATE_TRANSACTION_START', transaction);
  transaction.accessToken = googleApiUtil.getAccessToken();

  context.service.create('transaction', {id: transaction.transactionId}, transaction, function(err, newTransaction) {
    if (err) {
      return context.dispatch('CREATE_TRANSACTION_FAIL', err);
    }

    context.dispatch('CREATE_TRANSACTION_DONE', newTransaction);

    context.executeAction(navigateAction, {
      url: '/transactions'
    }, done);
  });
};
