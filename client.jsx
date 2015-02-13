/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/*global App, document, window */
'use strict';
//
//var React = require('react');
//var app = require('./app');
//var dehydratedState = window.App; // Sent from the server
//
//// dynamic stylesheet
//require('./assets/style.less');
//
//window.React = React; // For chrome dev tool support
//
//app.rehydrate(dehydratedState, function(err, context) {
//  if (err) {
//    return reject(new Error(err));
//  }
//
//  window.context = context;
//  var mountNode = document.getElementById('app');
//
//  React.render(app.getAppComponent()({
//    context: context.getComponentContext()
//  }), mountNode, function() {
//    console.log('React Rendered');
//  });
//});
//
//window.app = app;

var React = require('react');
var Router = require('react-router');
var getRoutes = require('./routes');

Router.run(getRoutes(), Router.HistoryLocation, function(Handler) {
  React.render(<Handler />, document.getElementById('app'));
});