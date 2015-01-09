'use strict';
var React = require('react');
var FluxibleApp = require('fluxible-app');
var fetchrPlugin = require('fluxible-plugin-fetchr');


var app = new FluxibleApp({
  appComponent: React.createFactory(require('./components/Main.jsx'))
});

app.plug(fetchrPlugin({
  xhrPath: '/api'
}));

module.exports = app;