/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/*global App, document, window */
'use strict';

var Promise = require('es6-promise').Promise;
var React = require('react');
var debug = require('debug');
var bootstrapDebug = debug('Example');
var app = require('./app');
var loadGooglePickerAction = require('./actions/loadGooglePicker');
var dehydratedState = window.App; // Sent from the server

window.React = React; // For chrome dev tool support
debug.enable('*');

bootstrapDebug('rehydrating app');

var rehydratePromise = new Promise(function(resolve, reject) {
  app.rehydrate(dehydratedState, function(err, context) {
    if (err) {
      return reject(new Error(err));
    }

    window.context = context;
    var mountNode = document.getElementById('app');

    bootstrapDebug('React Rendering');
    React.render(app.getAppComponent()({
      context: context.getComponentContext()
    }), mountNode, function() {
      bootstrapDebug('React Rendered');
    });
    resolve(context);
  });
});

var googleApiPromise = new Promise(function(resolve) {
  window.onGoogleApiLoaded = resolve;
});
window.app = app;
Promise.all([rehydratePromise, googleApiPromise]).then(function(values) {
  var context = values[0];

  context.getActionContext().executeAction(loadGooglePickerAction, {open: false});
});

