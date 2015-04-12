import express from 'express';
import HTTPStatus from 'http-status';

function request(path, method = 'GET') {
  method = method.toLocaleLowerCase();

  return function (target, name){
    apiController(target);
    target._route.addMethod(method, path, name);
  };
}

class RouteDescriptor {
  routes = [];
  params = [];
  routesMap = {};
  exceptionsMap = new Map();
  exceptionHandlersMap = {};

  constructor(path) {
    this.path = path;
  }

  addMethod(method, path, handler) {
    let route = {
      method,
      path,
      handler,
      statusCode: method === 'delete' ? HTTPStatus.NO_CONTENT : (method === 'put' ? HTTPStatus.CREATED : HTTPStatus.OK),
      options: []
    };

    this.routes.push(route);
    this.routesMap[handler] = route;
  }

  addExceptionHandlers(exceptions, handler) {
    let exceptionHandler = {
      handler,
      statusCode: HTTPStatus.INTERNAL_SERVER_ERROR
    };

    for (let exception of exceptions) {
      this.exceptionsMap.set(exception, exceptionHandler);
    }

    this.exceptionHandlersMap[handler] = exceptionHandler;
  }

  addParam(name, handler) {
    this.params.push({name, handler});
  }

  addRouteOptions(name, options) {
    this.routesMap[name].options = options;
  }

  addStatusCode(name, statusCode) {
    let method = this.routesMap[name];

    if (method === undefined) {
      method = this.exceptionHandlersMap[name];
    }

    if (method !== undefined) {
      method.statusCode = statusCode;
    }
  }

}

function param(paramName) {
  return function(target, name) {
    apiController(target);
    target._route.addParam(paramName, name);
  }
}

function args(...argsData) {
  return function(target, name) {
    apiController(target);
    target._route.addRouteOptions(name, argsData);
  }
}
args.body = 'body';
args.session = 'body';
args.request = 'request';
args.response = 'response';

function path(path) {
  return function(target) {

    target._route = new RouteDescriptor(path);
  };
}

function apiController(target) {
  if (target._route === undefined) {
    target._route = new RouteDescriptor();
  }
}

function exception(...exceptions) {
  return function(target, name) {
    apiController(target);
    target._route.addExceptionHandlers(exceptions, name);
  }
}

function responseStatus(statusCode) {
  return function(target, name) {
    apiController(target);

    target._route.addStatusCode(name, statusCode);
  }
}

class Router {
  _expressRouter = express.Router();

  constructor() {
    router.use(this.path, this._expressRouter);
  }
}


class TestError extends Error {
  message = 'My error message';
}

class AuthApi {
  @param('id')
  id(id) {
    return id*2;
  }

  @param('id2')
  id2(id) {
    return id*10;
  }

  @request('/:id2/:id', 'GET')
  @args(args.body, args.request, args.response)
  login(id2, id, body, req, res) {
    return String(id) + ' ' + String(id2);
  }

  @request('/', 'GET')
  index() {
    return 'tere';
  }

  @request('/test', 'GET')
  index2() {
    return 'test';
  }


  @exception(TestError)
  @responseStatus(HTTPStatus.NOT_FOUND)
  errorHandler(e) {
    return e.message;
  }
}

export default function(app) {
  let router = express.Router();

  let authApi = new AuthApi();

  let _router = authApi._route;



  for (let param of _router.params) {
    router.param(param.name, async (req, res, next, paramValue) => {
      try {
        let response = await authApi[param.handler](paramValue);
        req.paramValues = req.paramValues || [];
        req.paramValues.push(response);
      } catch (e) {
        console.log(e);
      }
      next();

    });
  }

  for (let route of _router.routes) {
    router[route.method](route.path, async (req, res) => {
      let params = req.paramValues || [];
      let extraParams = route.options.map((option) => {
        switch (option) {
          case args.session:
            return req.session;
          break;

          case args.request:
            return req;
          break;

          case args.response:
            return res;
          break;

          case args.body:
            return req.body;
          break;

          default:
            return null;
          break;
        }
      });
      let response = null;
      try {
        response = await authApi[route.handler](...params, ...extraParams);
        res.status(route.statusCode).end(String(response));
      } catch (e) {
        let errorHandler = _router.exceptionsMap.get(e.constructor)
        if (errorHandler !== undefined) {
          let message = authApi[errorHandler.handler](e);
          res.status(errorHandler.statusCode).end(message);
        } else {
          res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
        }
      }
    })
  }

  app.use('/api3', router);

}