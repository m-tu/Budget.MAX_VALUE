'use strict';

var showUser = require('../actions/showUsers');

module.exports = {
  home: {
    path: '/',
    method: 'get',
    page: 'home',
    label: 'Home',
    action: function (context, payload, done) {
      //context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: 'Home | flux-examples | routing' });
      done();
    }
  },
  users: {
    path: '/users',
    method: 'get',
    page: 'users',
    label: 'Users',
    action: showUser
  },
  register: {
    path: '/register',
    method: 'get',
    page: 'register',
    label: 'Register',
    action: showUser
  }
}