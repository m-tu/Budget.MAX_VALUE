'use strict';

import TransactionStore from '../stores/TransactionStore';
import showTransaction from './showTransaction';

export default function(context, params) {
  let { id } = params || {};

  if (id !== undefined) {
    return context.executeAction(showTransaction, id, function() {});
  }

  let transactionStore = context.getStore(TransactionStore);

  if (!transactionStore.isPopulated()) {
    context.dispatch('RECEIVE_TRANSACTIONS_START', params);

    context.service.read('transactions', params || {}, {}, (err, transactions) => {
      if (err) {
        context.dispatch('RECEIVE_TRANSACTIONS_FAILURE', params);
        return;
      }
      context.dispatch('RECEIVE_TRANSACTIONS_SUCCESS', transactions);
    });
  }
};
