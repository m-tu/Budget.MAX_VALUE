'use strict';

import Router from 'react-router';

let router = {
  router: null,

  makePath(to, params, query) {
    return this.router.makePath(to, params, query);
  },

  makeHref(to, params, query) {
    return this.router.makeHref(to, params, query);
  },

  transitionTo(to, params, query) {
    this.router.transitionTo(to, params, query);
  },

  replaceWith(to, params, query) {
    this.router.replaceWith(to, params, query);
  },

  goBack() {
    this.router.goBack();
  },

  run(location, callback, abortHandler) {
    let options = {
      routes: this.routes,
      location: location,
      onAbort: abortHandler
    };

    this.router = Router.create(options);

    this.router.run(callback);

    return this.router;
  }
};

export default router;

// routes might require views that might require actions that might require this file
// so we first export some stuff and then require routes
import routes from './routes.jsx';
router.routes = routes;