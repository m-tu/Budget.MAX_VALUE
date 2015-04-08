'use strict';

import { createStore } from 'fluxible/addons';

export default createStore({
  storeName: 'UserStore',
  handlers: {
    RECEIVE_USERS_SUCCESS: '_receiveUsers',
    CREATE_USER_SUCCESS: '_createUser'
  },
  initialize() {
    this.users = [];
  },
  _receiveUsers(users) {
    this.users = users;
    this.emitChange();
  },
  _createUser(user) {
    this.users.push(user);
    this.emitChange();
  },
  getAll() {
    return this.users;
  },
  dehydrate() {
    return {
      users: this.users
    };
  },
  rehydrate(state) {
    this.users = state.users;
  }
});