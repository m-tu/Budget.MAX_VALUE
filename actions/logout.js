'use strict';

module.exports = function(context, payload, done) {
    context.dispatch('LOG_OUT', payload);

    done();
};
