'use strict';

var router = require('../router');

module.exports = function (context, payload, done) {
  context.dispatch('LOG_IN_START', payload);

  context.service.create('auth', payload, {}, function (err, user) {
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
