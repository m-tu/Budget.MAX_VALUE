'use strict';

var showUser = require('../actions/showUsers');
var showTransactions = require('../actions/showTransactions');

module.exports = {
  home: {
    path: '/',
    method: 'get',
    page: 'home',
    label: 'Home'
  },
  users: {
    path: '/users',
    method: 'get',
    page: 'users',
    label: 'Users',
    action: showUser
  },
  transactions: {
    path: '/transactions',
    method: 'get',
    page: 'transactions',
    label: 'Transactions',
    action: function(context, payload, done) {
      // TODO find better solution
      context.dispatch('CHANGE_ROUTE_SUCCESS', payload);
      context.executeAction(showTransactions, null, done);
    }
  },
  createTransaction: {
    path: '/createTransaction',
    method: 'get',
    page: 'updateTransaction',
    label: 'Create transaction'
  },
  updateTransaction: {
    path: '/updateTransaction/:id',
    method: 'get',
    page: 'updateTransaction',
    label: 'Create transaction',
    action: function(context, payload, done) {
      context.dispatch('CHANGE_ROUTE_SUCCESS', payload);
      // TODO load only required transaction payload.params.id
      context.executeAction(showTransactions, null, done);
    }
  },
  register: {
    path: '/register',
    method: 'get',
    page: 'register',
    label: 'Register',
    action: showUser
  },
  login: {
    path: '/login',
    method: 'get',
    page: 'login',
    label: 'Login'
  }
};