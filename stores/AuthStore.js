'use strict';

import { createStore } from 'fluxible/addons';

export default createStore({
  storeName: 'AuthStore',
  handlers: {
    LOG_IN_START: '_logInStart',
    LOG_IN_DONE: '_logInDone',
    LOGGED_IN: '_logInDone',
    LOG_IN_FAIL: '_logInFail',
    LOG_OUT_DONE: '_logOut'
  },
  initialize() {
    this.loading = false;
    this.errorMessage = null;
    this.user = null;
  },
  _logInStart() {
    this.loading = true;
    this.errorMessage = null;
    this.emitChange();
  },
  _logInDone(user) {
    this.loading = false;
    this.errorMessage = null;
    this.user = user;
    this.emitChange();
  },
  _logInFail() {
    this.loading = false;
    this.errorMessage = 'Login failed! Check username and password.';
    this.emitChange();
  },
  _logOut() {
    this.user = null;
    this.emitChange();
  },
  getState() {
    return {
      loading: this.loading,
      errorMessage: this.errorMessage,
      user: this.user
    };
  },
  isLoggedIn() {
    return this.user !== null;
  },
  dehydrate () {
    return this.getState();
  },
  rehydrate(state) {
    this.loading = state.loading;
    this.errorMessage = state.errorMessage;
    this.user = state.user;
  }
});