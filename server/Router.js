import express from 'express';
import Route from './Route';
import Router2 from './Router2';

class Router {
  constructor() {
    this.expressRouter = express.Router();
  }
  route(path) {
    return new Route(this.expressRouter.route(path));
  }
  param(name, cb) {
    if (cb instanceof Router) {
      cb = cb.expressRouter;
    }

    this.expressRouter.param(name, cb);
  }
  use(name, cb) {
    if (!cb) {
      cb = name;
      name = null;
    }

    if (cb instanceof Router || cb instanceof Router2) {
      cb = cb.expressRouter;
    }

    if (name) {
      this.expressRouter.use(name, cb);
    } else {
      this.expressRouter.use(cb);
    }
  }
}

export default Router;