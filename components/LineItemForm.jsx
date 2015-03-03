'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var LabelEditor = require('./LabelEditor.jsx');

var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;

var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

var LineItemForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  propTypes: {
    lineItem: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
    labels: React.PropTypes.array.isRequired
  },
  getInitialState: function() {
    var lineItem = this.props.lineItem || {};

    return {
      name: lineItem.name || '',
      nameError: false,
      amount: lineItem.amount || '',
      amountError: false,
      labels: lineItem.labels || []
    };
  },
  render: function() {
    var isNew = !this.props.lineItem;

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
  clear: function() {
    this.setState(this.getInitialState());
  },
  _onSave: function() {
    if (!this._validate()) {
      return;
    }

    var lineItem = {
      id: this.props.lineItem ? this.props.lineItem.id : null,
      name: this.state.name.trim(),
      amount: this._round(parseFloat(this.state.amound)),
      labels: this.state.labels
    };

    this.setState({
      newName: '',
      newAmount: '',
      newLabels: []
    });

    this.props.onSave(lineItem);
  },
  _onCancel: function() {
    this.clear();

    if (typeof this.props.onCancel === 'function') {
      this.props.onCancel();
    }
  },
  _onKeyUp: function(e) {
    if (e.which === ENTER_KEY) {
      this._onSubmit();
    } else if (e.which === ESCAPE_KEY) {
      this.clear();
    }
  },
  _onLabelsChange: function(labels) {
    this.setState({
      labels: labels
    });
  },
  _validate: function() {
    var nameError = false;
    var amountError = false;

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
  _focus: function(ref) {
    ref = ref || 'name';

    this.refs[ref].getDOMNode().firstChild.focus();
  },
  _round: function(amount) {
    return Math.round(amount * 100) / 100;
  }
});

module.exports = LineItemForm;