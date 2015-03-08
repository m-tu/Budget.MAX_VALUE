'use strict';

import googleApiUtil from '../utils/googleApi';
import router from '../router';

export default function(context, transaction) {
  context.dispatch('UPDATE_TRANSACTION_START', transaction);
  transaction.accessToken = googleApiUtil.getAccessToken();

  context.service.create('transactions', {id: transaction.id}, transaction, function(err, newTransaction) {
    if (err) {
      return context.dispatch('UPDATE_TRANSACTION_FAIL', transaction, err);
    }

    context.dispatch('UPDATE_TRANSACTION_DONE', newTransaction);
    router.transitionTo('transactions');
  });
};
