import models from '../models';
import Router from '../server/Router';

let authRouter = new Router();

authRouter.route('/')
  .post(async (req, res) => {
    console.log(req.body);
    let user = await models.User.find({
        where: {
          username: req.body.username,
          password: req.body.password
        },
        attributes: ['id', 'username']
      });

    if (user === null) {
      res.sendStatus(401);
    } else {
      req.session.user = user;
      res.send(user);
    }
  });

export default authRouter;