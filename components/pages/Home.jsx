var React = require('react/addons');
var AuthStore = require('../../stores/AuthStore');
var StoreMixin = require('fluxible-app').StoreMixin;
var NavLink = require('flux-router-component').NavLink;

var Home = React.createClass({
  mixins: [StoreMixin],
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
      content = <p><span>Log in </span>
        <NavLink routeName="login" context={this.props.context}>here</NavLink>
      </p>;
    }

    return (
      content
    );
  }
});

module.exports = Home;