'use strict';

import React from 'react';
import LabelEditor from './LabelEditor.jsx';
import { Input, Button, ButtonToolbar } from 'react-bootstrap';

let ENTER_KEY = 13;
let ESCAPE_KEY = 27;

export default React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  propTypes: {
    lineItem: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
    labels: React.PropTypes.array.isRequired
  },
  getInitialState() {
    let lineItem = this.props.lineItem || {};

    return {
      name: lineItem.name || '',
      nameError: false,
      amount: lineItem.amount || '',
      amountError: false,
      labels: lineItem.labels || []
    };
  },
  render: function() {
    let isNew = !this.props.lineItem;

    return (
      <tr>
        <td>
          <Input type="text" placeholder="Name" ref="name" onKeyUp={this._onKeyUp}
                 bsStyle={this.state.nameError ? 'error' : null} valueLink={this.linkState('name')} />
        </td>
        <td>
          <Input type="number" placeholder="Amount" ref="amount" onKeyUp={this._onKeyUp}
                 bsStyle={this.state.amountError ? 'error' : null} valueLink={this.linkState('amount')} /></td>
        <td>
          <LabelEditor labels={this.props.labels} value={this.state.labels} onChange={this._onLabelsChange} />
        </td>
        <td style={{whiteSpace: 'nowrap'}}>
          <ButtonToolbar>
            <Button bsStyle="primary" bsSize={isNew ? 'medium' : 'xsmall'} onClick={this._onSave}>{isNew ? 'Add' : 'Save'}</Button>
            <Button bsStyle="warning" bsSize="xsmall" onClick={this._onCancel}>{isNew ? 'Clear' : 'Cancel'}</Button>
          </ButtonToolbar>
        </td>
      </tr>
    );
  },
  clear() {
    this.setState(this.getInitialState());
  },
  isDirty() {
    let {name = '', amount = ''} = this.props.lineItem || {};

    let isDirty = this.state.name !== name || this.state.amount !== amount ||
      !this.refs.amount.refs.input.getDOMNode().validity.valid;

    if (isDirty) {
      this._validate();
    } else {
      this.clear();
    }

    return isDirty;
  },
  _onSave() {
    if (!this._validate()) {
      return;
    }

    let lineItem = {
      id: this.props.lineItem ? this.props.lineItem.id : null,
      name: this.state.name.trim(),
      amount: this._round(parseFloat(this.state.amount)),
      labels: this.state.labels
    };

    this.setState({
      newName: '',
      newAmount: '',
      newLabels: []
    });

    this.props.onSave(lineItem);
  },
  _onCancel() {
    this.clear();

    if (typeof this.props.onCancel === 'function') {
      this.props.onCancel();
    }
  },
  _onKeyUp(e) {
    if (e.which === ENTER_KEY) {
      this._onSave();
    } else if (e.which === ESCAPE_KEY) {
      this.clear();
    }
  },
  _onLabelsChange(labels) {
    this.setState({
      labels: labels
    });
  },
  _validate() {
    let nameError = false;
    let amountError = false;

    if (isNaN(parseFloat(this.state.amount))) {
      amountError = true;
      this._focus('amount');
    }

    if (this.state.name.trim() === '') {
      nameError = true;
      this._focus('name');
    }

    this.setState({
      nameError: nameError,
      amountError: amountError
    });

    return !nameError && !amountError;
  },
  _focus(ref) {
    ref = ref || 'name';

    this.refs[ref].getDOMNode().firstChild.focus();
  },
  _round(amount) {
    return Math.round(amount * 100) / 100;
  }
});