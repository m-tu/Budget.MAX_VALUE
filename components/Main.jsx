var React = require('react');
var RouterMixin = require('flux-router-component').RouterMixin;
var StoreMixin = require('fluxible-app').StoreMixin;
var UserStore = require('../stores/UserStore');
var ApplicationStore = require('../stores/ApplicationStore');
var Header = require('./Header.jsx');
var Register = require('./pages/Register.jsx');
var Login = require('./pages/Login.jsx');
var Home = require('./pages/Home.jsx');

var Main = React.createClass({
  mixins: [RouterMixin, StoreMixin],
  statics: {
    storeListeners: {
      _onChange: [UserStore, ApplicationStore]
    }
  },
  getInitialState: function () {
    return this.getState();
  },
  getState: function () {
    var applicationState = this.getStore(ApplicationStore).getState();

    return {
      users: this.getStore(UserStore).getAll(),
      application: this.getStore(ApplicationStore).getState(),
      route: applicationState.route // needed for RouterMixin
    };
  },
  _onChange: function() {
    this.setState(this.getState());
  },
  render: function() {
    var users = this.state.users;
    var userList = users.map(function(user) {
      return (<div key={user.id}>{user.username}</div>);
    });

    var application = this.state.application;
    var page = '';

    switch (this.state.application.currentPageName) {
      case 'home':
        page = <Home context={this.props.context} />;
        break;
      case 'users':
        page = userList;
        break;
      case 'login':
        page = <Login context={this.props.context} />;
        break;
      case 'register':
        page = (
          <div>
            {userList}
            <Register context={this.props.context} />
          </div>
        );
        break;
    }

    return (
      <div>
        <Header context={this.props.context} links={application.pages} selected={application.currentPageName} />
        <div className="container">
          {page}
        </div>
      </div>
    );
  }
});

module.exports = Main;