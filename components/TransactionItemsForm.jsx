'use strict';

var React = require('react/addons');
var ReactBootstrap = require('react-bootstrap');
var LabelEditor = require('./LabelEditor.jsx');
var Label = require('./Label.jsx');
var LineItemForm = require('./LineItemForm.jsx');

var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;
var Button = ReactBootstrap.Button;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;

var ENTER_KEY = 13;
//var ESCAPE_KEY = 27;
var id = 0;

var TransactionItemEditor = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  propTypes: {
    labels: React.PropTypes.array.isRequired,
    lineItems: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func
  },
  getDefaultProps: function() {
    return {
      labels: [],
      lineItems: []
    };
  },
  getInitialState: function() {
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
  render: function() {
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
            <LineItemForm labels={this.props.labels} onSave={this._handleSave} />
            {this.props.lineItems.map(this._renderItem)}
            {this._renderTotal()}
          </tbody>
        </Table>
      </div>
    );
  },
  _renderItem: function(item) {
    var row;

    if (this.state.editing === item.id) {
      row = (
        <LineItemForm key={item.id} lineItem={item} onSave={this._handleSave} onCancel={this._handleSave} />
      );
    } else {
      row = (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>{item.amount}</td>
          <td>{(item.labels || []).map(this._renderItemLabels)}</td>
          <td>
            <ButtonToolbar hidden={this.state.editing}>
              <Button bsStyle="info" bsSize="xsmall" onClick={this._handleEdit.bind(this, item)}>Edit</Button>
              <Button bsStyle="danger" bsSize="xsmall" onClick={this._onRemove.bind(this, item)}>Remove</Button>
            </ButtonToolbar>
          </td>
        </tr>
      )
    }
    return row;
  },
  _renderItemLabels: function(label) {
    return (
      <Label key={label.id} label={label} />
    )
  },
  _handleEdit: function(item) {
    this.setState({
      editing: item.id
    });
  },
  _handleSave: function(newItem) {
    var index = -1;
    var i;

    for (i = 0; i < this.props.lineItems.length; i++) {
      if (this.props.lineItems[i].id === newItem.id) {
        index = i;
        break;
      }
    }
    var diff;

    if (index === -1) {
      // new
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
    this._emitChange(diff);
  },
  _onRemove: function(item) {
    var index = this.state.items.indexOf(item);

    if (item === -1) {
      return;
    }

    this._emitChange({
      $splice: [
        [index, 1]
      ]
    });
  },
  _emitChange: function(diff) {
    if (!this.props.onChange) {
      return;
    }

    this.props.onChange(
      React.addons.update(this.props.lineItems, diff)
    );

    //this._focus();
  },
  _renderTotal: function() {
    var sum = this.props.lineItems.reduce(function(sum, item) {
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

module.exports = TransactionItemEditor;