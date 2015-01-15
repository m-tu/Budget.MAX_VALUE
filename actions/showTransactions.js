'use strict';

module.exports = function (context, payload, done) {
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
};
