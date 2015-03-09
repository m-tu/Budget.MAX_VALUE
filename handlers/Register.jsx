'use strict';

import React from 'react';
import { createUserAction } from '../actions';

export default React.createClass({
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

    this.props.context.executeAction(createUserAction, {
      username: username,
      id: Date.now()
    });
    this.setState({username: ''});
  }
});