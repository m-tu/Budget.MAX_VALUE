import React from 'react';
import { Route, DefaultRoute, NotFoundRoute } from 'react-router';

import Root from './handlers/Root.jsx';
import Login from './handlers/Login.jsx';
import Register from './handlers/Register.jsx';
import Transactions from './handlers/Transactions.jsx';
import CreateTransaction from './handlers/CreateTransaction.jsx';
import UpdateTransaction from './handlers/UpdateTransaction.jsx';
import Labels from './handlers/Labels.jsx';
import Home from './handlers/Home.jsx';
import NotFound from './handlers/NotFound.jsx';

export default (
  <Route name="root" path="/" handler={Root}>
    <Route name="login" handler={Login}/>
    <Route name="register" handler={Register}/>

    <Route name="transactions" handler={Transactions}/>
    <Route name="createTransaction" handler={CreateTransaction}/>
    <Route name="updateTransaction" path="updateTransaction/:id" handler={UpdateTransaction}/>
    <Route name="labels" path="labels" handler={Labels}/>

    <DefaultRoute name="home" handler={Home}/>
    <NotFoundRoute name="not-found" handler={NotFound}/>
  </Route>
);