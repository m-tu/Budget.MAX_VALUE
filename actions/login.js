'use strict';

import router from '../router';

export default function (context, payload, done) {
  context.dispatch('LOG_IN_START', payload);

  context.service.create('auth', payload, {}, (err, user) => {
    if (err || !user) {
      context.dispatch('LOG_IN_FAIL', err);
      done();
      return;
    }
    context.dispatch('LOG_IN_DONE', user);
    router.transitionTo('home');
    done();
  });
};
