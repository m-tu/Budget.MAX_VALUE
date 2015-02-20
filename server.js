'use strict';

require('node-jsx').install({ extension: '.jsx' });
var express = require('express');
var serialize = require('serialize-javascript');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var React = require('react');
var app = require('./app');
var router = require('./router');
var HtmlComponent = React.createFactory(require('./components/Html.jsx'));
var models = require('./models');

require('es6-promise').polyfill();

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
// TODO read dynamically
fetchrPlugin.registerService(require('./services/user'));
fetchrPlugin.registerService(require('./services/label'));
fetchrPlugin.registerService(require('./services/auth'));
fetchrPlugin.registerService(require('./services/transaction'));

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

  router.run(req.url, function(Handler) {
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
  });
});

var port = process.env.PORT || 3005;

models.sequelize.sync({force: true}).then(function() {
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
      .then(function() {
        return models.Label.bulkCreate([{
          name: 'Food',
          UserId: user.id
        }, {
          name: 'Drink',
          UserId: user.id
        }]);
      });
  }).then(function() {
    // start server
    server.listen(port);
    console.log('Listening on port ' + port);
  });
});
