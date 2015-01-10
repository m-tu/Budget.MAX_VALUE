var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var UserStore = require('../stores/UserStore');

var Main = React.createClass({
  mixins: [StoreMixin],
  statics: {
    storeListeners: {
      _onChange: [UserStore]
    }
  },
  getInitialState: function () {
    return this.getState();
  },
  getState: function () {
    return {
      users: this.getStore(UserStore).getAll()
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

    return (
      <div>
        <h1>Hello</h1>
        {userList}
      </div>
    );
  }
});

module.exports = Main;