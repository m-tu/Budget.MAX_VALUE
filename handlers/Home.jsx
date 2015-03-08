'use strict';

import React from 'react';
import { Link } from 'react-router';
import { FluxibleMixin } from 'fluxible';
import AuthStore from '../stores/AuthStore';

export default React.createClass({
  mixins: [FluxibleMixin],
  statics: {
    storeListeners: {
      _onChange: [AuthStore]
    }
  },
  getInitialState: function() {
    return {
      user: this.getStore(AuthStore).getState().user
    };
  },
  _onChange: function() {
    this.setState(this.getInitialState());
  },
  render: function() {
    var loggedIn = this.state.user !== null,
      content;

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