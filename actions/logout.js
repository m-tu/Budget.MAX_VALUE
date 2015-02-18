'use strict';

var router = require('../router');

module.exports = function (context, payload, done) {
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
