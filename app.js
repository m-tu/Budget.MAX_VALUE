'use strict';

import React from 'react';
import FluxibleApp from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';
import * as stores from './stores';

let app = new FluxibleApp();

app.plug(fetchrPlugin({
  xhrPath: '/api'
}));

for (let storeName of Object.keys(stores)) {
  app.registerStore(stores[storeName]);
}

// TODO ugly
let createContext = app.createContext;

app.createContext = (...args) => {
  app.context = createContext.apply(app, args);
  return app.context;
};

export default app;
