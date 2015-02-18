'use strict';

var React = require('react');
var FluxibleApp = require('fluxible');
var fetchrPlugin = require('fluxible-plugin-fetchr');

var app = new FluxibleApp();

app.plug(fetchrPlugin({
  xhrPath: '/api'
}));

app.registerStore(require('./stores/UserStore'));
app.registerStore(require('./stores/TransactionStore'));
app.registerStore(require('./stores/AuthStore'));
app.registerStore(require('./stores/CreateTransactionStore'));

module.exports = app;