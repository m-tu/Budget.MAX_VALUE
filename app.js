'use strict';

import React from 'react';
import FluxibleApp from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';

import UserStore from './stores/UserStore';
import LabelStore from './stores/LabelStore';
import TransactionStore from './stores/TransactionStore';
import AuthStore from './stores/AuthStore';
import CreateTransactionStore from './stores/CreateTransactionStore';

var app = new FluxibleApp();

app.plug(fetchrPlugin({
  xhrPath: '/api'
}));

app.registerStore(UserStore);
app.registerStore(LabelStore);
app.registerStore(TransactionStore);
app.registerStore(AuthStore);
app.registerStore(CreateTransactionStore);

// TODO ugly
var createContext = app.createContext;

app.createContext = function() {

  app.context = createContext.apply(app, arguments);
  return app.context;
};

export default app;
