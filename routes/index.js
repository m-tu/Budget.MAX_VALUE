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
    action: showTransactions
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