'use strict';

var googleApiUtil = require('../utils/googleApi');
var router = require('../router');

module.exports = function(context, transaction) {
  context.dispatch('CREATE_TRANSACTION_START', transaction);
  transaction.accessToken = googleApiUtil.getAccessToken();

  context.service.create('transactions', {id: transaction.transactionId}, transaction, function(err, newTransaction) {
    if (err) {
      return context.dispatch('CREATE_TRANSACTION_FAIL', err);
    }

    context.dispatch('CREATE_TRANSACTION_DONE', newTransaction);
    router.transitionTo('transactions');
  });
};
