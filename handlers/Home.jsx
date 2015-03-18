'use strict';

import React from 'react';
import { Link } from 'react-router';
import { FluxibleMixin } from 'fluxible';
import { AuthStore } from '../stores';

export default React.createClass({
  mixins: [FluxibleMixin],
  statics: {
    storeListeners: {
      _onChange: [AuthStore]
    }
  },
  getInitialState() {
    return {
      user: this.getStore(AuthStore).getState().user
    };
  },
  _onChange() {
    this.setState(this.getInitialState());
  },
  render() {
    let loggedIn = this.state.user !== null;
    let content;

    if (loggedIn) {
      content = <h1>Welcome, {this.state.user.username}</h1>;
    } else {
      content = (
        <p>
          <span>Log in </span>
          <Link to="login">here</Link>
        </p>
      );
    }

    return (
      content
    );
  }
});