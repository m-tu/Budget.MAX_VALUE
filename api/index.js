import Router from '../server/Router';
import labels from './labels';
import auth from './auth';

let apiRouter = new Router();

// public api
apiRouter.use('/auth', auth);

apiRouter.use((req, res, next) => {
  if (!req.session.user) {
    res.sendStatus(401);
  } else {
    next();
  }
});

// private api
apiRouter.use('/labels', labels);

apiRouter.use((req, res) => {
  res.sendStatus(500);
});

export default apiRouter;