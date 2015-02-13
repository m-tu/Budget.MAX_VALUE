/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/*global App, document, window */
'use strict';

var React = require('react');
var Router = require('react-router');
var getRoutes = require('./routes');
var app = require('./app');

// dynamic stylesheet
require('./assets/style.less');

window.React = React; // For chrome dev tool support

var dehydratedState = window.App;

app.rehydrate(dehydratedState, function(err, context) {
  if (err) {
    throw new Error(err);
  }

  Router.run(getRoutes(), Router.HistoryLocation, function(Handler) {
    React.render(<Handler context={context.getComponentContext()} />, document.getElementById('app'));
  });
});
