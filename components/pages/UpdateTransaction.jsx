'use strict';

var React = require('react/addons');
var TransactionStore = require('../../stores/TransactionStore');
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var createTransaction = require('../../actions/createTransaction');

var Transactions = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      date: '',
      description: '',
      location: '',
      amount: '',
      method: ''
    };
  },
  render: function() {
    return (
      <div>
        <h2>Create transaction</h2>
        <form className="form-horizontal" onSubmit={this._onSubmit}>
          <Input type="datetime-local" label="Date" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
            valueLink={this.linkState('date')} />
          <Input type="textarea" label="Description" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
            valueLink={this.linkState('description')} />
          <Input type="text" label="Location" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
            valueLink={this.linkState('location')} />
          <Input type="number" label="Amount" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
            valueLink={this.linkState('amount')} />
          <Input type="select" label="Method" defaultValue="debit" labelClassName="col-xs-2"
            wrapperClassName="col-xs-10" valueLink={this.linkState('method')}
          >
            <option value="debit">Debit card</option>
            <option value="credit">Credit card</option>
            <option value="bank">Bank</option>
            <option value="cash">Cash</option>
          </Input>
          <Input type="submit" value="Save" wrapperClassName="col-xs-offset-2 col-xs-10" />
        </form>
      </div>
    );
  },
  _onSubmit: function(e) {
    e.preventDefault();

    var transaction = {
      date: new Date(this.state.date),
      description: this.state.description,
      location: this.state.location,
      amount: parseFloat(this.state.amount),
      method: this.state.method
    };

    this.props.context.executeAction(createTransaction, transaction);
  }
});

module.exports = Transactions;