'use strict';

import createStore from 'fluxible/utils/createStore';

export default createStore({
  storeName: 'ApplicationStore',
  handlers: {
    CHANGE_ROUTE_SUCCESS: 'handleNavigate',
    UPDATE_PAGE_TITLE: 'updatePageTitle',
    LOG_IN_DONE: '_logInDone',
    LOG_OUT_DONE: '_logInDone'
  },
  initialize: function () {
    this.currentPageName = null;
    this.currentPage = null;
    this.currentRoute = null;
    this.pageTitle = '';
  },
  handleNavigate: function(route) {
    var pageName = route.config.page;

    this._openPage(pageName, route);
  },
  updatePageTitle: function (title) {
    this.pageTitle = title.pageTitle;
    this.emitChange();
  },
  _openPage: function(pageName, route) {
    var page = this.pages[pageName];

    this.currentPageName = pageName;
    this.currentPage = page;
    this.currentRoute = route;
    this.emitChange();
  },
  _logInDone: function() {
    // TODO fix
    this._openPage('home', {
      url: 'home',
      navigate: {
        type: 'click'
      }
    });
  },
  getCurrentPageName: function () {
    return this.currentPageName;
  },
  getState: function () {
    return {
      currentPageName: this.currentPageName,
      currentPage: this.currentPage,
      pages: this.pages,
      route: this.currentRoute,
      pageTitle: this.pageTitle
    };
  },
  dehydrate: function () {
    return this.getState();
  },
  rehydrate: function (state) {
    this.currentPageName = state.currentPageName;
    this.currentPage = state.currentPage;
    this.pages = state.pages;
    this.currentRoute = state.route;
    this.pageTitle = state.pageTitle;
  }
});
