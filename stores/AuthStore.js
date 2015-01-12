'use strict';
var createStore = require('fluxible-app/utils/createStore');

module.exports = createStore({
  storeName: 'AuthStore',
  handlers: {
    LOG_IN_START: '_logInStart',
    LOG_IN_DONE: '_logInDone',
    LOG_IN_FAIL: '_logInFail'
  },
  initialize: function () {
    this.loading = false;
    this.errorMessage = null;
    this.user = null;
  },
  _logInStart: function() {
    this.loading = true;
    this.errorMessage = null;
    this.emitChange();
  },
  _logInDone: function(user) {
    this.loading = false;
    this.errorMessage = null;
    this.user = user;
    this.emitChange();
  },
  _logInFail: function(errorMessage) {
    this.loading = false;
    this.errorMessage = errorMessage;
    this.emitChange();
  },
  getState: function () {
    return {
      loading: this.loading,
      errorMessage: this.errorMessage,
      user: this.user
    };
  },
  dehydrate: function () {
    return this.getState();
  },
  rehydrate: function (state) {
    this.loading = state.loading;
    this.errorMessage = state.errorMessage;
    this.user = state.user;
  }
});