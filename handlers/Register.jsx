'use strict';

import React from 'react';
import { createUserAction } from '../actions';

export default React.createClass({
  getInitialState() {
    return {
      username: ''
    };
  },
  render() {
    return (
      <form onSubmit={this._onSubmit}>
        <input type="text" value={this.state.username} onChange={this._onChange} />
        <button>Save</button>
      </form>
    );
  },
  _onChange(event) {
    this.setState({username: event.target.value});
  },
  _onSubmit(event) {
    event.preventDefault();

    let username = this.state.username.trim();

    this.props.context.executeAction(createUserAction, {
      username: username,
      id: Date.now()
    });
    this.setState({username: ''});
  }
});