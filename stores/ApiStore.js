'use strict';
var createStore = require('fluxible-app/utils/createStore');

module.exports = createStore({
  storeName: 'ApiStore',
  handlers: {
    GOOGLE_API_LOADED: '_googleApiLoaded',
    CREATE_USER_SUCCESS: '_createUser'
  },
  initialize: function () {
    this.googleApiLoaded = false;
  },
  _googleApiLoaded: function() {
    this.googleApiLoaded = true;
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