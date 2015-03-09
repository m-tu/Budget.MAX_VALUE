'use strict';

import React from 'react';
import FluxibleApp from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';
import * as stores from './stores';

var app = new FluxibleApp();

app.plug(fetchrPlugin({
  xhrPath: '/api'
}));

for (let storeName in stores) {
  app.registerStore(stores[storeName]);
}

// TODO ugly
var createContext = app.createContext;

app.createContext = function() {

  app.context = createContext.apply(app, arguments);
  return app.context;
};

export default app;
