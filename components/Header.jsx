'use strict';

import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { FluxibleMixin } from 'fluxible';

import { AuthStore } from '../stores';
import { logoutAction } from '../actions';
import { NavItemLink } from 'react-router-bootstrap';

export default React.createClass({
  mixins: [FluxibleMixin],
  statics: {
    storeListeners: {
      _onChange: [AuthStore]
    }
  },
  getInitialState() {
    return {
      isLoggedIn: this.getStore(AuthStore).isLoggedIn()
    };
  },
  _onChange() {
    this.setState(this.getInitialState());
  },
  render: function() {
    let menus = this.state.isLoggedIn
      ? ['home', 'transactions', 'createTransaction', 'labels']
      : ['home', 'login', 'register'];
    let linksHTML = menus.map(name => {
      var label = name.slice(0, 1).toUpperCase() + name.slice(1);

      return (
        <NavItemLink key={name} to={name}>{label}</NavItemLink>
      );
    });

    if (this.state.isLoggedIn) {
      linksHTML.push(
        <li key="/logout">
          <a href="/logout" onClick={this._logOut}>Log out</a>
        </li>
      );
    }

    return (
      <Navbar>
        <Nav>
          {linksHTML}
        </Nav>
      </Navbar>
    );
  },
  _logOut(event) {
    event.preventDefault();

    this.props.context.executeAction(logoutAction);
  }
});
