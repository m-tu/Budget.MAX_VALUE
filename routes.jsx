var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;

module.exports =  (
  <Route name="root" path="/" handler={require('./handlers/Root.jsx')}>
    <Route name="login" handler={require('./handlers/Login.jsx')}/>
    <Route name="register" handler={require('./handlers/Register.jsx')}/>

    <Route name="transactions" handler={require('./handlers/Transactions.jsx')}/>
    <Route name="createTransaction" handler={require('./handlers/CreateTransaction.jsx')}/>
    <Route name="updateTransaction" path="updateTransaction/:id" handler={require('./handlers/UpdateTransaction.jsx')}/>
    <Route name="labels" path="labels" handler={require('./handlers/Labels.jsx')}/>

    <DefaultRoute name="home" handler={require('./handlers/Home.jsx')}/>
    <NotFoundRoute name="not-found" handler={require('./handlers/NotFound.jsx')}/>
  </Route>
);