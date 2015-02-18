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

  run: function(location, callback) {
    this.router = Router.run(this.routes, location, callback);

    return this.router;
  }
};

// routes might require vies that might require actions that might require this file
// so we export some stuff and then require routes
module.exports.routes = require('./routes');