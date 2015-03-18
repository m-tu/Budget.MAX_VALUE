'use strict';

import React from 'react';

import { Input } from 'react-bootstrap';
import validateTransaction from '../validators/transaction';
import rome from 'rome';

let formElements = [
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

let dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

export default React.createClass({
  rome: null,
  propTypes: {
    transaction: React.PropTypes.object,
    onChange: React.PropTypes.func,
    disabled: React.PropTypes.bool
  },
  mixins: [React.addons.LinkedStateMixin, React.addons.PureRenderMixin],
  getInitialState(transaction) {
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
  componentDidMount() {
    this.rome = rome(this.refs.date.refs.input.getDOMNode(), {
      inputFormat: 'YYYY-MM-DD HH:mm:ss',
      weekStart: 1,
      styles: {
        dayTable: 'table'
      }
    }).on('data', date => this.setState({date: date}));
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.transaction) {
      this.setState(this.getInitialState(nextProps.transaction));
    }
  },
  render() {
    return (
      <div className="form-horizontal">
        {formElements.map(this._renderInput)}
      </div>
    );
  },
  _renderInput(input) {
    let error = this.state.errors[input.name];

    return (
      <Input key={input.name} type={input.type} label={input.label} value={this.state[input.name]}
             onChange={this._onInputChange.bind(null, input)} disabled={this.props.disabled}
             help={error} bsStyle={error ? 'error' : null}
             ref={input.name}
             labelClassName="col-xs-2" wrapperClassName="col-xs-10"
             onBlur={input.noValidate ? null : this._validateInput.bind(null, input)}>
        {input.props ? input.props.children : null}
      </Input>
    );
  },
  /**
   * @returns {{data: {}, errors: {}, hasErrors: boolean}}
   */
  validate() {
    let result = validateTransaction(this.state);

    this.setState({
      errors: result.errors
    });

    return result;
  },
  getTransaction() {
    return validateTransaction(this.state).data;
  },
  _onInputChange(input, e) {
    let state = {
      errors: React.addons.update(this.state.errors, {
        [input.name]: {
          $set: null
        }
      }),
      [input.name]: e.target.value
    };

    this.setState(state);

    if (input.name === 'date') {
      this.rome.setValue(e.target.value);
    }
  },
  _validateInput(input) {
    let validation = validateTransaction(this.state);

    if (validation.errors[input.name]) {
      let errors = Object.assign({}, this.state.errors, {
        [input.name]: validation.errors[input.name]
      });

      this.setState({
        errors: errors
      });
    }
  }
});