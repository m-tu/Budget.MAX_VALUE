'use strict';

module.exports = function(context, payload, done) {
  context.dispatch('CREATE_USER_SUCCESS', payload);

    // TODO call context.service.create
  done();
};
