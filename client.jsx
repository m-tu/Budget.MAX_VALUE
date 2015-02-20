'use strict';

var React = require('react');
var Router = require('react-router');
var router = require('./router');
var app = require('./app');

require('es6-promise').polyfill();

// dynamic stylesheet
require('./assets/style.less');

window.React = React; // For chrome dev tool support

var dehydratedState = window.App;

app.rehydrate(dehydratedState, function(err, context) {
  if (err) {
    throw new Error(err);
  }

  router.run(Router.HistoryLocation, function(Handler) {
    React.render(<Handler context={context.getComponentContext()} />, document.getElementById('app'));
  });
});
