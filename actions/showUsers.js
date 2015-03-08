'use strict';

export default function (context, payload, done) {
  context.dispatch('RECEIVE_USERS_START', payload);

  context.service.read('user', {}, {}, function (err, users) {
    if (err) {
      context.dispatch('RECEIVE_USERS_FAILURE', payload);
      done();
      return;
    }
    context.dispatch('RECEIVE_USERS_SUCCESS', users);
    done();
  });
};
