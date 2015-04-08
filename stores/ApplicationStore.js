'use strict';

import { createStore } from 'fluxible/addons';

export default createStore({
  storeName: 'ApplicationStore',
  handlers: {
    CHANGE_ROUTE_SUCCESS: 'handleNavigate',
    UPDATE_PAGE_TITLE: 'updatePageTitle',
    LOG_IN_DONE: '_logInDone',
    LOG_OUT_DONE: '_logInDone'
  },
  initialize() {
    this.currentPageName = null;
    this.currentPage = null;
    this.currentRoute = null;
    this.pageTitle = '';
  },
  handleNavigate(route) {
    let pageName = route.config.page;

    this._openPage(pageName, route);
  },
  updatePageTitle(title) {
    this.pageTitle = title.pageTitle;
    this.emitChange();
  },
  _openPage(pageName, route) {
    let page = this.pages[pageName];

    this.currentPageName = pageName;
    this.currentPage = page;
    this.currentRoute = route;
    this.emitChange();
  },
  _logInDone() {
    // TODO fix
    this._openPage('home', {
      url: 'home',
      navigate: {
        type: 'click'
      }
    });
  },
  getCurrentPageName() {
    return this.currentPageName;
  },
  getState() {
    return {
      currentPageName: this.currentPageName,
      currentPage: this.currentPage,
      pages: this.pages,
      route: this.currentRoute,
      pageTitle: this.pageTitle
    };
  },
  dehydrate() {
    return this.getState();
  },
  rehydrate(state) {
    this.currentPageName = state.currentPageName;
    this.currentPage = state.currentPage;
    this.pages = state.pages;
    this.currentRoute = state.route;
    this.pageTitle = state.pageTitle;
  }
});
