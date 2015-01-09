'use strict';

//var restify = require('restify');
//var app = restify.createServer();
//var models = require('./models');
//
//function respond(req, res, next) {
//  res.send({hello: req.params.name});
//  next();
//}
//
//// set routes
//require('./routes')(app);
//
//// set static html
//app.get(/\/.*/, restify.serveStatic({
//  directory: __dirname + '/public',
//  default: 'index.html'
//}));
//
//// init db
//models.sequelize.sync().then(function() {
//  app.listen(8080, function() {
//    console.log('Listening at ' + app.name + ' on port ' + 8080);
//  });
//});


require('node-jsx').install({ extension: '.jsx' });
var express = require('express');
var serialize = require('serialize-javascript');
var bodyParser = require('body-parser');
var React = require('react');
var app = require('./app');
//var showTodos = require('./actions/showTodos');
var HtmlComponent = React.createFactory(require('./components/Html.jsx'));


var server = express();
server.set('state namespace', 'App');
server.use('/public', express.static(__dirname + '/build'));
server.use(bodyParser.json());


// Get access to the fetchr plugin instance
var fetchrPlugin = app.getPlugin('FetchrPlugin');

// Register our todos REST service
//fetchrPlugin.registerService(require('./services/todo'));

// Set up the fetchr middleware
server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());

// Every other request gets the app bootstrap
server.use(function (req, res, next) {
  //var context = app.createContext({
  //  req: req, // The fetchr plugin depends on this
  //  xhrContext: {
  //    _csrf: req.csrfToken() // Make sure all XHR requests have the CSRF token
  //  }
  //});

  //context.executeAction(showTodos, {}, function (err) {
  //  if (err) {
  //    if (err.status && err.status === 404) {
  //      return next();
  //    }
  //    else {
  //      return next(err);
  //    }
  //  }

    //var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

    var AppComponent = app.getAppComponent();
    var html = React.renderToStaticMarkup(HtmlComponent({
      //state: exposed,
      //context: context.getComponentContext(),
      //markup: React.renderToString(AppComponent({
      //  context: context.getComponentContext()
      //}))
    }));

    res.write(html);
    res.end();
  //});
});

var port = process.env.PORT || 3005;
server.listen(port);
console.log('Listening on port ' + port);