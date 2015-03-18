'use strict';

import TransactionStore from '../stores/TransactionStore';

export default function (context, transactionId) {
  let transactionStore = context.getStore(TransactionStore);

  if (!transactionStore.hasTransaction(transactionId)) {
    context.dispatch('RECEIVE_TRANSACTION_START', transactionId);

    context.service.read('transactions', {id: transactionId}, (err, transaction) => {
      if (err || transaction === null) {
        context.dispatch('RECEIVE_TRANSACTION_FAILURE', transactionId);
        return;
      }

      context.dispatch('RECEIVE_TRANSACTION_SUCCESS', transaction);
    });
  }
};
