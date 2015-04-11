'use strict';

import { createStore } from 'fluxible/addons';

// TODO do we need this store?
export default createStore({
  storeName: 'ApiStore',
  handlers: {
    GOOGLE_API_LOADED: '_googleApiLoaded',
    CREATE_USER_SUCCESS: '_createUser'
  },
  initialize() {
    this.googleApiLoaded = false;
  },
  _googleApiLoaded() {
    this.googleApiLoaded = true;
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