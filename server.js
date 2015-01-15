'use strict';

require('node-jsx').install({ extension: '.jsx' });
var express = require('express');
var serialize = require('serialize-javascript');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var navigateAction = require('flux-router-component').navigateAction;
var React = require('react');
var app = require('./app');
var HtmlComponent = React.createFactory(require('./components/Html.jsx'));
var models = require('./models');

var server = express();
server.set('state namespace', 'App');
server.use('/public', express.static(__dirname + '/build'));
server.use('/public', express.static(__dirname + '/assets'));
server.use(bodyParser.json());
server.use(session({
  store: new RedisStore(),
  secret: 'budget max valuez',
  resave: false,
  saveUninitialized: true
}));


// Get access to the fetchr plugin instance
var fetchrPlugin = app.getPlugin('FetchrPlugin');

// Register our users REST service
fetchrPlugin.registerService(require('./services/user'));
fetchrPlugin.registerService(require('./services/auth'));
fetchrPlugin.registerService(require('./services/transaction'));

// Set up the fetchr middleware
server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());

// Every other request gets the app bootstrap
server.use(function (req, res, next) {
  var context = app.createContext({
    req: req // The fetchr plugin depends on this
  });

  var actionContext = context.getActionContext();

  // Initialize store states: maybe come up with better solution?
  if (req.session.user) {
    actionContext.dispatch('LOGGED_IN', req.session.user);
  }

  actionContext.executeAction(navigateAction, {
    url: req.url
  }, function (err) {
    if (err) {
      if (err.status && err.status === 404) {
        return next();
      }
      else {
        return next(err);
      }
    }

    var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

    var AppComponent = app.getAppComponent();
    var html = React.renderToStaticMarkup(HtmlComponent({
      state: exposed,
      //context: context.getComponentContext(),
      markup: React.renderToString(AppComponent({
        context: context.getComponentContext()
      }))
    }));

    res.write(html);
    res.end();
  });
});

var port = process.env.PORT || 3005;

models.sequelize.sync().then(function() {
  server.listen(port);
  console.log('Listening on port ' + port);
});
