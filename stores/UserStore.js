'use strict';

import createStore from 'fluxible/utils/createStore';

export default createStore({
  storeName: 'UserStore',
  handlers: {
    RECEIVE_USERS_SUCCESS: '_receiveUsers',
    CREATE_USER_SUCCESS: '_createUser'
  },
  initialize: function () {
    this.users = [];
  },
  _receiveUsers: function(users) {
    this.users = users;
    this.emitChange();
  },
  _createUser: function(user) {
    this.users.push(user);
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