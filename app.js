'use strict';
var React = require('react');
var FluxibleApp = require('fluxible');
var fetchrPlugin = require('fluxible-plugin-fetchr');
var routrPlugin = require('fluxible-plugin-routr');

var app = new FluxibleApp({
  appComponent: React.createFactory(require('./components/Main.jsx'))
});

app.plug(fetchrPlugin({
  xhrPath: '/api'
}));
app.plug(routrPlugin({
  routes: require('./routes')
}));

app.registerStore(require('./stores/ApplicationStore'));
app.registerStore(require('./stores/UserStore'));
app.registerStore(require('./stores/TransactionStore'));
app.registerStore(require('./stores/AuthStore'));
app.registerStore(require('./stores/CreateTransactionStore'));

module.exports = app;