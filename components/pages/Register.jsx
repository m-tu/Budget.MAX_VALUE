'use strict';

var React = require('react');
var createUser = require('../../actions/createUser');

var Register = React.createClass({
  getInitialState: function() {
    return {
      username: ''
    };
  },
  render: function() {
    return (
      <form onSubmit={this._onSubmit}>
        <input type="text" value={this.state.username} onChange={this._onChange} />
        <button>Save</button>
      </form>
    );
  },
  _onChange: function(event) {
    this.setState({username: event.target.value});
  },
  _onSubmit: function(event) {
    event.preventDefault();
    var username = this.state.username.trim();

    this.props.context.executeAction(createUser, {
      username: username,
      id: Date.now()
    });
    this.setState({username: ''});
  }
});

module.exports = Register;