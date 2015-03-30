import express from 'express';

class Router {
  constructor(conf) {
    this.expressRouter = express.Router();

    this._resolveConf(conf);
  }

  _resolveConf(conf) {
    if (conf.params) {
      for (let paramName of Object.keys(conf.params)) {
        this._addParam(paramName, conf.params[paramName]);
      }
    }

    if (conf.routes) {
      for (let route of Object.keys(conf.routes)) {
        this._addRoute(route, conf.routes[route]);
      }
    }
  }

  _addParam(name, handler) {
    this.expressRouter.param(name, async (...args) => {
      let [,,next] = args;

      try {
        await handler(...args);
      } catch (e) {
        console.log(e);
        next();
      }
    });
  }

  _addRoute(routeName, routeHandlers) {
    let route = this.expressRouter.route(routeName);

    for (let method of Object.keys(routeHandlers)) {
      let methodHandlers = routeHandlers[method];

      if (typeof methodHandlers === 'function') {
        methodHandlers = [methodHandlers];
      }

      route[method](methodHandlers.map(handler => {
        return async (...args) => {
          let [,,next] = args;
          try {
            await handler(...args);
          } catch (e) {
            console.log(e);
            next();
          }
        };
      }));
    }
  }
}

export default Router;