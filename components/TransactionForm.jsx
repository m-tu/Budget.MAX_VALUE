'use strict';

import React from 'react';

import { Input } from 'react-bootstrap';
import validateTransaction from '../validators/transaction';
import rome from 'rome';

var formElements = [
  {
    name: 'date',
    label: 'Date',
    type: 'text',
    noValidate: true
  }, {
    name: 'description',
    label: 'Description',
    type: 'textarea'
  }, {
    name: 'location',
    label: 'Location',
    type: 'text'
  }, {
    name: 'amount',
    label: 'Amount',
    type: 'number'
  }, {
    name: 'method',
    label: 'Method',
    type: 'select',
    props: {
      value: 'bank',
      children: [
        <option key="debit" value="debit">Debit card</option>,
        <option key="credit" value="credit">Credit card</option>,
        <option key="bank" value="bank">Bank</option>,
        <option key="cash" value="cash">Cash</option>
      ]
    }
  }
];

var dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

export default React.createClass({
  rome: null,
  propTypes: {
    transaction: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func,
    disabled: React.PropTypes.bool
  },
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(transaction) {
    transaction = transaction || this.props.transaction || {};

    return {
      date: transaction.date ? rome.moment(transaction.date).format(dateTimeFormat) : '',
      description: transaction.description || '',
      location: transaction.location || '',
      amount: transaction.amount || '',
      method: transaction.method || 'bank',
      errors: {}
    };
  },
  componentDidMount: function() {
    this.rome = rome(this.refs.date.refs.input.getDOMNode(), {
      inputFormat: 'YYYY-MM-DD HH:mm:ss',
      weekStart: 1,
      styles: {
        dayTable: 'table'
      }
    }).on('data', date => this.setState({date: date}));
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getInitialState(nextProps.transaction));
  },
  render: function() {
    return (
      <div className="form-horizontal">
        {formElements.map(this._renderInput)}
      </div>
    );
  },
  _renderInput: function(input) {
    var props = input.props || {};
    var error = this.state.errors[input.name];
    var type = input.type;
    var children = null;

    return (
      <Input key={input.name} type={type} label={input.label} {...props} value={this.state[input.name]}
             onChange={this._onInputChange.bind(null, input)} disabled={this.props.disabled}
             help={error} bsStyle={error ? 'error' : null}
             ref={input.name}
             labelClassName="col-xs-2" wrapperClassName="col-xs-10"
             onBlur={input.noValidate ? null : this._validateInput.bind(null, input)}>
        {children}
      </Input>
    );
  },
  /**
   * @returns {{data: {}, errors: {}, hasErrors: boolean}}
   */
  validate: function() {
    var result = validateTransaction(this.state);

    this.setState({
      errors: result.errors
    });

    return result;
  },
  getTransaction: function() {
    return validateTransaction(this.state).data;
  },
  _onInputChange: function(input, e) {
    var state = {
      errors: Object.assign({}, this.state.errors)
    };
    state[input.name] = e.target.value;
    state.errors[input.name] = null;

    this.setState(state);

    if (input.name === 'date') {
      this.rome.setValue(e.target.value);
    }
  },
  _validateInput: function(input) {
    var validation = validateTransaction(this.state);
    var errors = this.state.errors;

    if (validation.errors[input.name]) {
      errors = Object.assign({}, errors);
      errors[input.name] = validation.errors[input.name];

      this.setState({
        errors: errors
      });
    }
  }
});