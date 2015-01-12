var React = require('react/addons');
var ReactBootstrap = require('react-bootstrap');
var AuthStore = require('../stores/AuthStore');
var StoreMixin = require('fluxible-app').StoreMixin;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Alert = ReactBootstrap.Alert;
var login = require('../actions/login');

var Login = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  //static: {
  //  storeListeners: [AuthStore]
  //},
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
  //onChange: function() {
  //  this.setState(this.getStore(AuthStore).getState());
  //},
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

    this.setState({
      errorMessage: null,
      loading: true
    });

    //this.props.context.executeAction(login, {
    //  username: username,
    //  password: password
    //});
  }
});

module.exports = Login;