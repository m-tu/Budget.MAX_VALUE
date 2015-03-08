'use strict';

import router from '../router';

export default function (context, payload, done) {
  context.dispatch('LOG_OUT_START');

  context.service.delete('auth', payload, {}, function (err) {
    if (err) {
      context.dispatch('LOG_OUT_FAIL');
    } else {
      context.dispatch('LOG_OUT_DONE');
    }

    router.transitionTo('home');
    done();
  });
};
