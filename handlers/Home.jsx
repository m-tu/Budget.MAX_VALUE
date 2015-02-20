var React = require('react');
var ReactRouterBootstrap = require('react-router');
var FluxibleMixin = require('fluxible').Mixin;
var AuthStore = require('../stores/AuthStore');
var Link = ReactRouterBootstrap.Link;

module.exports = React.createClass({
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