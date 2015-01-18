'use strict';

var navigateAction = require('flux-router-component').navigateAction;

module.exports = function(context, transaction, done) {
  context.dispatch('CREATE_TRANSACTION_DONE', transaction);

  // TODO call context.service.create

  context.executeAction(navigateAction, {
    url: '/transactions'
  }, done);
};
