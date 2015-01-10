'use strict';
var createStore = require('fluxible-app/utils/createStore');

module.exports = createStore({
  storeName: 'UserStore',
  handlers: {
    RECEIVE_USERS_SUCCESS: '_receiveUsers'
  },
  initialize: function () {
    this.users = [];
  },
  _receiveUsers: function(users) {
    this.users = users;
    this.emitChange();
  },
  getAll: function () {
    return this.users;
  },
  dehydrate: function () {
    return {
      users: this.users
    };
  },
  rehydrate: function (state) {
    this.users = state.users;
  }
});