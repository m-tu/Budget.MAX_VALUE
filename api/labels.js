import Router from '../server/Router';
import Router2 from '../server/Router2';
import models from '../models';

function sanitazeName(name) {
  return name && String(name).trim();
}

let labelsRouter = new Router();

labelsRouter.param('id', async (req, res, next, id) => {
  id = Number(id);

  let label = await models.Label.find({
    where: {
      UserId: req.session.user.id,
      id: id
    }
  });

  if (!label) {
    return res.sendStatus(404);
  } else {
    req.label = label;
    next();
  }
});

let route = labelsRouter.route('/');

route.get(async (req, res) => {
  let label = await models.Label.findAll({
    where: {
      UserId: req.session.user.id
    }
  });

  res.send(label);
});

route.post(async (req, res) => {
  let name = sanitazeName(req.body.name);

  if (!name) {
    return res.sendStatus(400);
  }

  let label = await models.Label.create({
    name: name,
    UserId: req.session.user.id
  });

  res.status(201).send(label);
});

route = labelsRouter.route('/:id');

route.get((req, res) => {
  res.send(req.label);
});

route.put(async (req, res) => {
  let name = sanitazeName(req.body.name);

  if (!name) {
    return res.sendStatus(400);
  }

  let label = await req.label.updateAttributes({
    name: name
  });

  res.send(label);
});

route.delete(async (req, res) => {
  await req.label.destroy();

  res.sendStatus(204);
});

function labelValidator(req, res, next) {
  let name = req.body.name && String(req.body.name).trim();

  if (!name) {
    return res.sendStatus(400);
  }

  req.data = {
    name: name
  };
  next();
}

// some dest structure

let test = {
  params: {
    async id(req, res, next, id){
      id = Number(id);

      let label = await models.Label.find({
        where: {
          UserId: req.session.user.id,
          id: id
        }
      });

      if (!label) {
        return res.sendStatus(404);
      } else {
        req.label = label;
        next();
      }
    }
  },
  routes: {
    '/': {
      async get(req, res){
        let label = await models.Label.findAll({
          where: {
            UserId: req.session.user.id
          },
          attributes: ['id', 'name']
        });

        res.send(label);
      },
      post: [labelValidator, async (req, res) => {
        let label = await models.Label.create({
          name: req.data.name,
          UserId: req.session.user.id
        });

        res.status(201).send({
          id: label.id,
          name: label.name
        });
      }]
    },
    '/:id': {
      get(req, res) {
        res.send(req.label);
      },
      put: [labelValidator, async (req, res) => {
        let label = await req.label.updateAttributes({
          name: req.data.name
        });

        res.send(label);
      }],
      async delete(req, res) {
        await req.label.destroy();

        res.sendStatus(204);
      }
    }
  }
};

labelsRouter = new Router2(test);

export default labelsRouter;