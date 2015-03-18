'use strict';

import React from 'react/addons';

import { Table, Button, ButtonToolbar } from 'react-bootstrap';

import Label from './Label.jsx';
import LineItemForm from './LineItemForm.jsx';

export default React.createClass({
  _id: 0,
  mixins: [React.addons.LinkedStateMixin],
  propTypes: {
    labels: React.PropTypes.array.isRequired,
    lineItems: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func
  },
  getDefaultProps() {
    return {
      labels: [],
      lineItems: []
    };
  },
  getInitialState() {
    return {
      items: [],
      newName: '',
      newAmount: '',
      newLabels: [],
      nameError: false,
      amountError: false,
      sum: 0,
      editing: null
    }
  },
  render() {
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Amount</th>
              <th>Labels</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <LineItemForm ref="newForm" labels={this.props.labels} onSave={this._handleSave} />
            {this.props.lineItems.map(this._renderItem)}
            {this._renderTotal()}
          </tbody>
        </Table>
      </div>
    );
  },
  validate() {
    return !this.refs.newForm.isDirty();
  },
  _renderItem(item) {
    let row;

    if (this.state.editing === item.id) {
      row = (
        <LineItemForm labels={this.props.labels} key={item.id} lineItem={item}
                      onSave={this._handleSave} onCancel={this._handleEdit} />
      );
    } else {
      row = (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>{item.amount}</td>
          <td>{(item.labels || []).map(this._renderItemLabels)}</td>
          <td>
            <ButtonToolbar hidden={this.state.editing}>
              <Button bsStyle="info" bsSize="xsmall" onClick={this._handleEdit.bind(null, item)}>Edit</Button>
              <Button bsStyle="danger" bsSize="xsmall" onClick={this._onRemove.bind(null, item)}>Remove</Button>
            </ButtonToolbar>
          </td>
        </tr>
      )
    }
    return row;
  },
  _renderItemLabels(label) {
    return (
      <Label key={label.id} label={label} />
    )
  },
  _handleEdit(item) {
    this.setState({
      editing: item ? item.id : null
    });
  },
  _handleSave(newItem) {
    let index = newItem.id === null ? -1 : this.props.lineItems.findIndex(lineItem => lineItem.id === newItem.id);
    let diff;

    if (index === -1) {
      // new
      newItem.id = '_' + this._id++;
      diff = {
        $unshift: [newItem]
      };
    } else {
      diff = {
        $splice: [
          [index, 1, newItem]
        ]
      };
    }

    this.setState({
      editing: null
    });
    this.refs.newForm.clear();
    this._emitChange(diff);
  },
  _onRemove(item) {
    let index = this.state.items.indexOf(item);

    if (item === -1) {
      return;
    }

    this._emitChange({
      $splice: [
        [index, 1]
      ]
    });
  },
  _emitChange(diff) {
    if (!this.props.onChange) {
      return;
    }

    this.props.onChange(
      React.addons.update(this.props.lineItems, diff)
    );

    //this._focus();
  },
  _renderTotal() {
    let sum = this.props.lineItems.reduce(function(sum, item) {
      return sum + item.amount;
    }, 0);

    return (
      <tr>
        <th>{this.props.lineItems.length} items</th>
        <th>{sum}</th>
        <th></th>
        <th></th>
      </tr>
    );
  }

  //_focus: function(ref) {
  //  ref = ref || 'name';
  //
  //  this.refs[ref].getDOMNode().firstChild.focus();
  //}
});