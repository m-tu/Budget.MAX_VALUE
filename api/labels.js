import express from 'express';
let labelsRouter = express.Router();
let labels = [
  {
    "id": 1,
    "name": "Food"
  },
  {
    "id": 2,
    "name": "Drink"
  }
];

labelsRouter.param('id', (req, res, next, id) => {
  id = Number(id);

  let label = labels.find(label => label.id === id);

  if (!label) {
    return res.sendStatus(404);
  } else {
    req.label = label;
    next();
  }
});

labelsRouter.route('/')
  .get((req, res) => {
    res.send(labels);
  })

  .post((req, res) => {
    let name = req.body.name;

    if (!name) {
      return res.sendStatus(400);
    }

    let label = {
      id: labels.length,
      name: name
    };

    labels.push(label);
    res.status(201).send(label);
  });

labelsRouter.route('/:id')
  .get((req, res) => {
    res.send(req.label);
  })

  .put((req, res) => {
    if (req.body.name) {
      req.label.name = req.body.name;
    }
    res.send(req.label);
  })

  .delete((req, res) => {
    let index = labels.indexOf(req.label);

    labels.splice(index, 1);
    res.sendStatus(204);
  });

export default labelsRouter;