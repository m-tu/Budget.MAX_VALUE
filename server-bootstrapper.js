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

var HtmlComponent = React.createFactory(Html);
var RedisStore = connectRedis(session);

var server = express();
var isDevEnv = server.get('env') === 'development';
server.set('state namespace', 'App');

if (isDevEnv) {
  // use webpack dev server for serving static files
  server.use('/public', function (req, res) {
    res.redirect('http://localhost:3006/public' + req.path);
  });
}

server.use('/public', express.static(__dirname + '/build'));
server.use(bodyParser.json({limit: '20mb'}));

// session

var sessionStore = new RedisStore();
sessionStore.client.on('error', function(err) {
  console.warn('REDIS error', err);
  console.log('Switching to memory store');
  sessionStore.client.end();

  sessionMiddleware = session({
    secret: 'budget max valuez',
    resave: false,
    saveUninitialized: true
  });
});
var sessionMiddleware = session({
  store: sessionStore,
  secret: 'budget max valuez',
  resave: false,
  saveUninitialized: true
});

server.use(function(req, res, next) {
  sessionMiddleware(req, res, next);
});


// get user file
server.get('/files/:id([0-9]+)', function(req, res, next) {
  models.File.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(file) {
    if (file) {
      res.writeHeader(200, {'Content-Type': file.thumbnailType});
      res.end(file.thumbnailData, 'binary');
    } else {
      return new Error();
    }
  }).finally(next);
});

// Get access to the fetchr plugin instance
var fetchrPlugin = app.getPlugin('FetchrPlugin');

// Register our users REST service
for (let serviceName in services) {
  fetchrPlugin.registerService(services[serviceName]);
}

// Set up the fetchr middleware
server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());

// Every other request gets the app bootstrap
server.use(function (req, res) {
  var context = app.createContext({
    req: req // The fetchr plugin depends on this
  });

  // Initialize store states: maybe come up with better solution?
  var actionContext = context.getActionContext();

  if (req.session.user) {
    actionContext.dispatch('LOGGED_IN', req.session.user);
  }

  router.run(
    req.url,
    function(Handler) {
      var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

      var html = React.renderToStaticMarkup(HtmlComponent({
        isDevEnv: isDevEnv,
        state: exposed,
        markup: React.renderToString(React.createElement(Handler, {
          context: context.getComponentContext()
        }))
      }));

      res.write(html);
      res.end();
    },
    function(abortReason) {
      if (abortReason.to) {
        res.redirect(abortReason.to);
      } else {
        res.sendStatus(500);
      }
    }
  );
});

var port = process.env.PORT || 3005;

models.sequelize.sync({force: true}).then(function() {
  var transaction1;

  // TODO move initialization to separate file
  // initialize data
  models.User.create({
    username: 'timmu',
    password: 'parool'
  }).then(function(user) {
    return models.Transaction.bulkCreate([{
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
    }])
      .then(function(transactions) {
        transaction1 = transactions[0];

        return models.Label.bulkCreate([{
          name: 'Food',
          UserId: user.id
        }, {
          name: 'Drink',
          UserId: user.id
        }]);
      })
      .then(function() {
        return models.LineItem.bulkCreate([{
          name: 'item 1',
          amount: 100,
          TransactionId: 1,
          labels: [1,2]
        }]).then(function() {
          return models.Label.findAll().then(function(labels) {
            return models.LineItem.findAll().then(function(lineItems) {
              return lineItems[0].addLabels(labels);
            });
          });
        });
      });
  }).then(function() {
    // start server
    server.listen(port);
    console.log('Listening on port ' + port);
  });
}, function(err) {
  console.log('Failed to connect to DB: ' + err.toString());
});
