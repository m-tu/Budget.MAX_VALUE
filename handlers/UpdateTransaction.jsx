'use strict';

var React = require('react/addons');
var Router = require('react-router');

var FluxibleMixin = require('fluxible').Mixin;
var TransactionStore = require('../stores/TransactionStore');
var LabelStore = require('../stores/LabelStore');
var CreateTransactionStore = require('../stores/CreateTransactionStore');

var createTransaction = require('../actions/createTransaction');
var clearUnsavedTransaction = require('../actions/clearUnsavedTransaction');
var showLabelsAction = require('../actions/showLabels');
var showTransactions = require('../actions/showTransactions');

var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Alert = ReactBootstrap.Alert;

var AuthMixin = require('../mixins/Auth');

var TransactionForm = require('../components/TransactionForm.jsx');
var TransactionItemsForm = require('../components/TransactionItemsForm.jsx');

var Transactions = React.createClass({
  mixins: [
    AuthMixin,
    React.addons.LinkedStateMixin,
    Router.State,
    FluxibleMixin
  ],
  statics: {
    storeListeners: {
      _onChange: [CreateTransactionStore, LabelStore, TransactionStore]
    },
    willTransitionFrom: function (transition, component) {
      component._clearUnsavedData();
    }
  },
  getInitialState: function() {
    return this._getStateFromStores();
  },
  _getStateFromStores: function() {
    return {
      transaction: this.getStore(TransactionStore).getTransaction(this._getTransactionId()) || {},
      labels: this.getStore(LabelStore).getLabels(),
      lineItems: []
    }
  },
  componentWillReceiveProps: function() {
    this.setState(this.getInitialState());
    this._loadTransaction();
  },
  _getTransactionId: function() {
    return parseInt(this.getParams().id) || null;
  },
  _onChange: function() {
    this.setState(this._getStateFromStores());
  },
  _loadTransaction: function() {
    var transactionId = this._getTransactionId();

    if (transactionId !== null) {
      this.props.context.executeAction(showTransactions, {id: transactionId});
    }
  },
  componentDidMount: function() {
    this.props.context.executeAction(showLabelsAction);
    this._loadTransaction();
  },
  render: function() {
    var errorMessage = null;

    if (this.state.hasErrors) {
      errorMessage = (
        <Alert bsStyle="danger">
          <strong>There were problems creating transaction</strong>
        </Alert>
      );
    }

    var transaction = this.state.transaction;

    return (
      <div>
        <h1>Update Transaction</h1>
        {errorMessage}
        <TransactionForm ref="transactionForm" transaction={transaction.pendingData || transaction}
                         disabled={transaction.pending} />
        <Input type="submit" bsStyle="primary" onClick={this._onSubmit} disabled={this.state.working}
               value={transaction.pending ? 'Working...' : 'Save'}
        />
        <TransactionItemsForm ref="lineItemsForm" lineItems={this.state.lineItems} onChange={this._onLineItemsChange}
                              labels={this.state.labels} />

      </div>
    );
  },
  _onSubmit: function(e) {
    e.preventDefault();

    var result = this.refs.transactionForm.validate();

    if (result.hasErrors) {
      this.setState({
        hasErrors: true,
        errors: result.errors
      });

      return;
    }

    result.data.id = this.state.transaction.id;

    this.setState({
      hasErrors: false,
      errors: {}
    });

    this.props.context.executeAction(createTransaction, result.data);
  },
  _clearUnsavedData: function() {
    this.props.context.executeAction(clearUnsavedTransaction);
  }
});

module.exports = Transactions;