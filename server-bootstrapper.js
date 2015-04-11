'use strict';

import express from 'express';
import serialize from 'serialize-javascript';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectRedis from 'connect-redis';
import React from 'react';
import app from './app';
import router from './router';
import Html from './components/Html.jsx';
import models from './models';
import * as services from './services';

let HtmlComponent = React.createFactory(Html);
let RedisStore = connectRedis(session);

let server = express();
let isDevEnv = server.get('env') === 'development';
server.set('state namespace', 'App');

if (isDevEnv) {
  // use webpack dev server for serving static files
  server.use('/public', (req, res) => {
    res.redirect('http://localhost:3006/public' + req.path);
  });
}

server.use('/public', express.static(__dirname + '/build'));
server.use(bodyParser.json({limit: '20mb'}));

// session

let sessionStore = new RedisStore();
sessionStore.client.on('error', (err) => {
  console.warn('REDIS error', err);
  console.log('Switching to memory store');
  sessionStore.client.end();

  sessionMiddleware = session({
    secret: 'budget max valuez',
    resave: false,
    saveUninitialized: true
  });
});
let sessionMiddleware = session({
  store: sessionStore,
  secret: 'budget max valuez',
  resave: false,
  saveUninitialized: true
});

server.use((req, res, next) => {
  sessionMiddleware(req, res, next);
});

async function tere(req, res, next) {
  let file = await models.File.findOne({
    where: {
      id: req.params.id
    }
  });

  if (file) {
    res.writeHeader(200, {'Content-Type': file.thumbnailType});
    res.end(file.thumbnailData, 'binary');
  } else {
    next();
  }
}

// get user file
server.get('/files/:id([0-9]+)', tere);

// Get access to the fetchr plugin instance
let fetchrPlugin = app.getPlugin('FetchrPlugin');

// Register our users REST service
for (let serviceName of Object.keys(services)) {
  fetchrPlugin.registerService(services[serviceName]);
}

import api from './api';
server.use('/api2', api.expressRouter);



import test from './api/test';
//test(server);

// Set up the fetchr middleware
server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());

// Every other request gets the app bootstrap
server.use((req, res) => {
  let context = app.createContext({
    req: req // The fetchr plugin depends on this
  });

  // Initialize store states: maybe come up with better solution?
  let actionContext = context.getActionContext();

  if (req.session.user) {
    actionContext.dispatch('LOGGED_IN', req.session.user);
  }

  router.run(
    req.url,
    (Handler) => {
      let exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

      let html = React.renderToStaticMarkup(HtmlComponent({
        isDevEnv: isDevEnv,
        state: exposed,
        markup: React.renderToString(React.createElement(Handler, {
          context: context.getComponentContext()
        }))
      }));

      res.write(html);
      res.end();
    },
    (abortReason) => {
      if (abortReason.to) {
        res.redirect(abortReason.to);
      } else {
        res.sendStatus(500);
      }
    }
  );
});

server.use((err, req, res) => {
  res.sendStatus(404);
});

let port = process.env.PORT || 3005;
let env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  models.sequelize.sync({force: true}).then(async function tere() {
    // TODO move initialization to separate file
    // initialize data
    let user = await models.User.create({
      username: 'timmu',
      password: 'parool'
    });

    await models.Transaction.bulkCreate([{
      date: new Date(),
      description: 'positive',
      location: 'Töö',
      amount: 100,
      method: 'bank',
      UserId: user.id
    }, {
      date: new Date(),
      description: 'negative',
      location: 'selver',
      amount: -13.55,
      method: 'debit',
      UserId: user.id
    }]);

    await models.Label.bulkCreate([{
      name: 'Food',
      UserId: user.id
    }, {
      name: 'Drink',
      UserId: user.id
    }]);

    await models.LineItem.bulkCreate([{
      name: 'item 1',
      amount: 100,
      TransactionId: 1,
      labels: [1, 2]
    }]);

    let labels = await models.Label.findAll();
    let lineItems = await models.LineItem.findAll();
    await lineItems[0].addLabels(labels);

    console.log('Listening on port ' + port);
  }, (err) => {
    console.log('Failed to connect to DB: ' + err.toString());
  });
} else {
  models.sequelize.sync();
}
// start server
server.listen(port);

export default server;