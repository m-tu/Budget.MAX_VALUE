'use strict';

var TransactionStore = require('../stores/TransactionStore');
var showTransaction = require('./showTransaction');

module.exports = function (context, params) {

  if (typeof params === 'object' && params !== null && typeof params.id !== 'undefined') {
    return context.executeAction(showTransaction, params.id, function() {});
  }

  var transactionStore = context.getStore(TransactionStore);

  if (!transactionStore.isPopulated()) {
    context.dispatch('RECEIVE_TRANSACTIONS_START', params);

    context.service.read('transactions', params || {}, {}, function (err, transactions) {
      if (err) {
        context.dispatch('RECEIVE_TRANSACTIONS_FAILURE', params);
        return;
      }
      context.dispatch('RECEIVE_TRANSACTIONS_SUCCESS', transactions);
    });
  }
};
