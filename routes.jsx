var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;

module.exports = function() {
  return [
    <Route name="root" path="/" handler={require('./handlers/Root')}>
      <Route name="home2" handler={require('./handlers/Home2')} />
      <DefaultRoute name="home" handler={require('./handlers/Home')} />
      <NotFoundRoute name="not-found" handler={require('./handlers/NotFound')} />
    </Route>
  ];
};