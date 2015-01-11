/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';


module.exports = function (context, payload, done) {
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