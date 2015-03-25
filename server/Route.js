class Route {
  constructor(expressRoute) {
    this.expressRoute = expressRoute;
    expressRoute.get((req, res, next) => {
      next();
    })
  }
  async get(cb) {
    return this.handle('get', cb);
  }
  async post(cb) {
    return this.handle('post', cb);
  }
  async put(cb) {
    return this.handle('put', cb);
  }
  async delete(cb) {
    return this.handle('delete', cb);
  }
  handle(method, cb) {
    this.expressRoute[method](async (...args) => {
      let [,,next] = args;
      try {
        await cb(...args);
      } catch (e) {
        next();
      }
    });
  }
}

export default Route;