'use strict';

import 'babel/polyfill';

import React from 'react';
import Router from 'react-router';
import router from './router';
import app from './app';

// dynamic stylesheet
import './assets/style.less';

window.React = React; // For chrome dev tool support

window.app = app;

let dehydratedState = window.App;

app.rehydrate(dehydratedState, (err, context) => {
  if (err) {
    throw new Error(err);
  }

  router.run(Router.HistoryLocation, (Handler) => {
    React.render(<Handler context={context.getComponentContext()} />, document.getElementById('app'));
  });
});
