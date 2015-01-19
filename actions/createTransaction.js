'use strict';

var navigateAction = require('flux-router-component').navigateAction;

module.exports = function(context, transaction, done) {
  context.dispatch('CREATE_TRANSACTION_START', transaction);

  context.service.create('transaction', {}, transaction, function(err, newTransaction) {
    if (err) {
      return context.dispatch('CREATE_TRANSACTION_FAIL', err);
    }

    context.dispatch('CREATE_TRANSACTION_DONE', newTransaction);

    context.executeAction(navigateAction, {
      url: '/transactions'
    }, done);
  });
};
