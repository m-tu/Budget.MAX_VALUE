'use strict';

var TransactionStore = require('../stores/TransactionStore');

module.exports = function (context, transactionId) {

  var transactionStore = context.getStore(TransactionStore);

  if (!transactionStore.hasTransaction(transactionId)) {
    context.dispatch('RECEIVE_TRANSACTION_START', transactionId);

    context.service.read('transactions', {id: transactionId}, function (err, transaction) {
      if (err || transaction === null) {
        context.dispatch('RECEIVE_TRANSACTION_FAILURE', transactionId);
        return;
      }

      context.dispatch('RECEIVE_TRANSACTION_SUCCESS', transaction);
    });
  }
};