'use strict';

var React = require('react/addons');
var Router = require('react-router');

var FluxibleMixin = require('fluxible').Mixin;
var TransactionStore = require('../stores/TransactionStore');
var LabelStore = require('../stores/LabelStore');
var CreateTransactionStore = require('../stores/CreateTransactionStore');

var createTransaction = require('../actions/createTransaction');
var showLabelsAction = require('../actions/showLabels');
var showTransactions = require('../actions/showTransactions');

var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Alert = ReactBootstrap.Alert;

var validateTransaction = require('../validators/transaction');

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
    }
  },
  getInitialState: function() {
    return this._getStateFromStores();
  },
  _getStateFromStores: function() {
    return {
      transaction: this.getStore(TransactionStore).getTransaction(this._getTransactionId()),
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

    return (
      <div>
        <h1>Update Transaction</h1>
        {errorMessage}
        <TransactionForm ref="transactionForm" transaction={this.state.transaction}/>
        <Input type="submit" bsStyle="primary" onClick={this._onSubmit} disabled={this.state.working}
               value={this.state.working ? 'Working...' : 'Save'}
        />
        <TransactionItemsForm ref="lineItemsForm" lineItems={this.state.lineItems} onChange={this._onLineItemsChange}
                              labels={this.state.labels} />

      </div>
    );
  },
  _onSubmit: function(e) {
    e.preventDefault();

    var result = validateTransaction(this.state);

    if (result.hasErrors) {
      this.setState({
        hasErrors: true,
        errors: result.errors
      });

      return;
    }

    result.data.transactionId = this.state.transactionId;

    result.data.files = this.state.files.map(function(file) {
      return {
        id: file.id,
        title: file.title,
        embedLink: file.embedLink,
        imageUrl: file.imageUrl,
        thumbnailLink: file.thumbnailLink
      };
    });

    this.setState({
      hasErrors: false,
      errors: {}
    });

    this.props.context.executeAction(createTransaction, result.data);
  }
});

module.exports = Transactions;