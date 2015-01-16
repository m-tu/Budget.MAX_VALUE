'use strict';

var TransactionStore = require('../stores/TransactionStore');

module.exports = function (context, payload, done) {
  done = done || function() {};

  var transactionStore = context.getStore(TransactionStore);

  if (!transactionStore.isPopulated()) {
    context.dispatch('RECEIVE_TRANSACTIONS_START', payload);

    context.service.read('transaction', {}, {}, function (err, transactions) {
      if (err) {
        context.dispatch('RECEIVE_TRANSACTIONS_FAILURE', payload);
        done();
        return;
      }
      context.dispatch('RECEIVE_TRANSACTIONS_SUCCESS', transactions);
      done();
    });
  } else {
    done();
  }
};
