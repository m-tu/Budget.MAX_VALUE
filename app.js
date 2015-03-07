'use strict';

var React = require('react');
var FluxibleApp = require('fluxible');
var fetchrPlugin = require('fluxible-plugin-fetchr');

var app = new FluxibleApp();

app.plug(fetchrPlugin({
  xhrPath: '/api'
}));

app.registerStore(require('./stores/UserStore'));
app.registerStore(require('./stores/LabelStore'));
app.registerStore(require('./stores/TransactionStore'));
app.registerStore(require('./stores/AuthStore'));
app.registerStore(require('./stores/CreateTransactionStore'));

// TODO ugly
var createContext = app.createContext;

app.createContext = function() {

  app.context = createContext.apply(app, arguments);
  return app.context;
};


module.exports = app;
