import express from 'express';

export default function(app) {
  let router = express.Router();

  app.use('/api3', router);

  function request(path, method = 'GET') {
    method = method.toLocaleLowerCase();

    return function (target, name, descriptor){
      console.log(name);

      target._expressRouter[method](path, async (req, res, next) => {

        try {
          let response = await descriptor.value(req.params, req.body);
          res.send(response);
        } catch (e) {
          res.send(405);
        }
      })

    };
  }

  function path(path) {
    return function(target) {
      target.path = path;
      target._expressRouter = express.Router()
      router.use(path, target._expressRouter);
    };
  }

  @path('/auth')
  class AuthApi {

    @request('/', 'GET')
    index() {
      return 'tere';
    }

    @request('/:id', 'GET')
    login(params) {
      return params.id;
    }
  }

  new AuthApi();

  //api.auth.post('/', {username: 'tii', password: 'fd'})
  //api.labels.get('/:id', {id: 12})
  //api.labels.post('/:id', {id: 12}, {name: 'fdfd'});

}