'use strict';

var React = require('react/addons');
var ReactBootstrap = require('react-bootstrap');
var LabelEditor = require('./LabelEditor.jsx');
var Label = require('./Label.jsx');

var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;
var Button = ReactBootstrap.Button;

var ENTER_KEY = 13;
//var ESCAPE_KEY = 27;
var id = 0;

var TransactionItemEditor = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
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
            {this._renderForm()}
            {this.state.items.map(this._renderItem)}
            {this._renderTotal()}
          </tbody>
        </Table>
      </div>
    );
  },
  _renderForm: function() {
    return (
      <tr>
        <td><Input type="text" placeholder="Name" ref="name" onKeyUp={this._onKeyUp} bsStyle={this.state.nameError ? 'error' : null} valueLink={this.linkState('newName')} /></td>
        <td><Input type="number" placeholder="Amount" ref="amount" onKeyUp={this._onKeyUp} bsStyle={this.state.amountError ? 'error' : null} valueLink={this.linkState('newAmount')} /></td>
        <td>
          <LabelEditor labels={this.props.labels} value={this.state.newLabels} onChange={this._onLabelsChange} />
        </td>
        <td><Input type="button"  value="Add" onClick={this._onSubmit} /></td>
      </tr>
    );

  },
  _renderItem: function(item) {
    return (
      <tr>
        <td onDoubleClick={this._handleEditName.bind(this, item, 'name')}>
          {(this.state.editing === item.id && this.state.editType === 'name'
            ? <Input type="text" placeholder="Name" ref={'name' + item.id} onBlur={this._handleSave} defaultValue={item.name} />
            : item.name)}
        </td>
        <td onDoubleClick={this._handleEditName.bind(this, item, 'amount')}>
          {(this.state.editing === item.id && this.state.editType === 'amount'
            ? <Input type="text" placeholder="Amount" ref={'amount' + item.id} onBlur={this._handleSave} defaultValue={item.amount} />
            : item.amount)}
        </td>
        <td>{item.labels.map(this._renderItemLabels)}</td>
        <td><Button bsStyle="danger" bsSize="xsmall" onClick={this._onRemove.bind(this, item)}>Remove</Button></td>
      </tr>
    );
  },
  _renderItemLabels: function(label) {
    return (
      <Label key={label.id} label={label} />
    )
  },
  _handleEditName: function(item, name) {

    this.setState({
      editing: item.id,
      editType: name
    });

    window.setTimeout(function() {
      var node = this.refs[name + item.id].getDOMNode().firstChild;
      node.focus();
      //console.log(node)
      node.setSelectionRange(0, node.value.length);
    }.bind(this),100)
  },
  _handleSave: function() {
    this.setState({
      editing: null
    });
  },
  _onLabelsChange: function(labels) {
    this.setState({
      newLabels: labels
    });
  },
  _onRemove: function(item) {
    var index = this.state.items.indexOf(item);

    if (item === -1) {
      return;
    }

    this.setState({
      sum: this._round(this.state.sum - item.amount),
      items: React.addons.update(this.state.items, {
        $splice: [
          [index, 1]
        ]
      })
    });

    this._focus();
  },
  _renderTotal: function() {
    return (
      <tr>
        <th>{this.state.items.length} items</th>
        <th>{this.state.sum}</th>
        <th></th>
        <th></th>
      </tr>
    );
  },
  _onSubmit: function() {
    if (!this._validate()) {
      return;
    }

    var amount = this._round(parseFloat(this.state.newAmount));

    this.setState({
      items: React.addons.update(this.state.items, {
        $unshift: [{
          id: id++,
          name: this.state.newName,
          amount: amount,
          labels: this.state.newLabels
        }]
      }),
      newName: '',
      newAmount: '',
      newLabels: [],
      sum: this._round(this.state.sum + amount)
    });

    this._focus();
  },
  _validate: function() {
    var nameError = false;
    var amountError = false;

    if (isNaN(parseFloat(this.state.newAmount))) {
      amountError = true;
      this._focus('amount');
    }

    if (this.state.newName === '') {
      nameError = true;
      this._focus('name');
    }

    this.setState({
      nameError: nameError,
      amountError: amountError
    });

    return !nameError && !amountError;
  },
  _onKeyUp: function(e) {
    if (e.which === ENTER_KEY) {
      this._onSubmit();
    }
  },
  _focus: function(ref) {
    ref = ref || 'name';

    this.refs[ref].getDOMNode().firstChild.focus();
  },
  _round: function(amount) {
    return Math.round(amount * 100) / 100;
  }
});

module.exports = TransactionItemEditor;