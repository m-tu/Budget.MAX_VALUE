'use strict';

var Router = require('react-router');

module.exports = {
  router: null,

  makePath: function(to, params, query) {
    return this.router.makePath(to, params, query);
  },

  makeHref: function(to, params, query) {
    return this.router.makeHref(to, params, query);
  },

  transitionTo: function(to, params, query) {
    this.router.transitionTo(to, params, query);
  },

  replaceWith: function(to, params, query) {
    this.router.replaceWith(to, params, query);
  },

  goBack: function() {
    this.router.goBack();
  },

  run: function(location, callback, abortHandler) {
    var options = {
      routes: this.routes,
      location: location,
      onAbort: abortHandler
    };

    this.router = Router.create(options);

    this.router.run(callback);

    return this.router;
  }
};

// routes might require views that might require actions that might require this file
// so we first export some stuff and then require routes
module.exports.routes = require('./routes');