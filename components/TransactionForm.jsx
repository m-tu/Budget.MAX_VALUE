var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var validateTransaction = require('../validators/transaction');

var formElements = [
  {
    name: 'date',
    label: 'Date',
    type: 'datetime-local'
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

var TransactionForm = React.createClass({
  propTypes: {
    transaction: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func
  },
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(transaction) {
    transaction = transaction || this.props.transaction || {};

    return {
      date: transaction.date ? transaction.date.toISOString().slice(0, -1) : '',
      description: transaction.description || '',
      location: transaction.location || '',
      amount: transaction.amount || '',
      method: transaction.method || 'bank',
      errors: {}
    };
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

    return (
      <Input key={input.name} type={input.type} label={input.label} {...props} value={this.state[input.name]}
             onChange={this._onInputChange.bind(this, input)}
             help={error} bsStyle={error ? 'error' : null}
             labelClassName="col-xs-2" wrapperClassName="col-xs-10" onBlur={this._validateInput.bind(this, input)} />
    );
  },
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
module.exports = TransactionForm;