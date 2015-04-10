import Router from '../server/Router';
import models from '../models';

let transactionsRouter = new Router();

transactionsRouter.param('id', async (req, res, next, id) => {
  id = Number(id);

  let transaction = await models.Transaction.find({
    where: {
      UserId: req.session.user.id,
      id: id
    },
    attributes: ['id', 'date', 'amount', 'description', 'method', 'location']
  });

  if (!transaction) {
    return res.sendStatus(404);
  } else {
    req.transaction = transaction;
    next();
  }
});

let route = transactionsRouter.route('/');

route.get(async (req, res) => {
  let transactions = await models.Transaction.findAll({
    where: {
      UserId: req.session.user.id
    },
    attributes: ['id', 'date', 'amount', 'description', 'method', 'location']
  });

  res.send(transactions);
});

route = transactionsRouter.route('/:id');

route.get((req, res) => {
  res.send(req.transaction);
});

route.delete(async (req, res) => {
  await req.transaction.destroy();

  res.sendStatus(204);
});

export default transactionsRouter;