import express from 'express';
import Route from './Route';

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

    if (cb instanceof Router) {
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