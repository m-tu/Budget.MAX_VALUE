'use strict';

import React from 'react';
import { Input, Button } from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.string,
    withButton: React.PropTypes.bool,
    inline: React.PropTypes.bool,
    isModal: React.PropTypes.bool
  },
  getDefaultProps() {
    return {
      label: ''
    }
  },
  getInitialState() {
    return {
      name: this.props.label,
      error: null
    }
  },
  render() {
    return (
      <form className={this.props.inline ? 'form-inline' : ''} onSubmit={this.validate}>
        <Input
          type="text" placeholder="Label name" autoFocus
          value={this.state.name} onChange={this._onChange}
          help={this.state.error} bsStyle={this.state.error ? 'error' : null}
          buttonAfter={this.props.withButton ? <Button type="submit" bsStyle="success">Add</Button> : null}
        />
      </form>
    );
  },
  isValid() {
    return this.getLabelName() !== '';
  },
  getLabelName() {
    return this.state.name.trim();
  },
  _onChange(e) {
    this.setState({
      name: e.target.value,
      error: null
    });
  },
  validate(e) {
    e && e.preventDefault();

    if (this.isValid()) {
      let name = this.getLabelName();
      this.props.onChange(name);

      if (!this.props.isModal) {
        // for some reason, react tries to update component after the modal is destroyed
        this.setState({
          name: ''
        });
      }
    } else {
      this.setState({
        error: 'Enter non-empty name for label'
      })
    }
  }
});