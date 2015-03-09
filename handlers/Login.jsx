'use strict';

import React from 'react/addons';
import { Input, Alert } from 'react-bootstrap';
import { AuthStore } from '../stores';
import { FluxibleMixin } from 'fluxible';
import { loginAction } from '../actions';

export default React.createClass({
  mixins: [React.addons.LinkedStateMixin, FluxibleMixin],
  statics: {
    storeListeners: {
      _onChange: [AuthStore]
    }
  },
  getInitialState: function() {
    return this.getState();
  },
  getState: function () {
    //var storeState = this.getStore(AuthStore).getState();

    return {
      username: '',
      password: '',
      errorMessage: null,//storeState.errorMessage,
      loading: false//storeState.loading
    };
  },
  _onChange: function() {
    this.setState(this.getStore(AuthStore).getState());
  },
  render: function() {
    var loading = this.state.loading;

    return (
      <form onSubmit={this._onSubmit}>
        {this.state.errorMessage ? <Alert bsStyle="danger">{this.state.errorMessage}</Alert> : null}
        <Input type="text" label="Name" placeholder="Insert name" valueLink={this.linkState('username')} disabled={loading} />
        <Input type="password" label="Name" placeholder="Insert password" valueLink={this.linkState('password')} disabled={loading} />
        <Input type="submit" bsStyle="primary" value={loading ? 'Loading...' : 'Log in'} disabled={loading} />
      </form>
    );
  },
  _onSubmit: function(e) {
    e.preventDefault();

    var username = this.state.username.trim(),
      password = this.state.password.trim();

    if (username === '' || password === '') {
      this.setState({
        errorMessage: 'Insert username and password!'
      });
      return;
    }

    this.props.context.executeAction(loginAction, {
      username: username,
      password: password
    });
  }
});