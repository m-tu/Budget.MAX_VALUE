'use strict';

import React from 'react/addons';
import { State } from 'react-router';
import { FluxibleMixin } from 'fluxible';
import { CreateTransactionStore, LabelStore, TransactionStore } from '../stores';
import {
  clearUnsavedTransactionAction, createTransactionAction, showLabelsAction, showTransactionsAction
  } from '../actions';
import { Input, Alert } from 'react-bootstrap';

import AuthMixin from '../mixins/Auth';

import TransactionForm from '../components/TransactionForm.jsx';
import TransactionItemsForm from '../components/TransactionItemsForm.jsx';

export default React.createClass({
  mixins: [
    AuthMixin,
    React.addons.LinkedStateMixin,
    State,
    FluxibleMixin
  ],
  statics: {
    storeListeners: {
      _onChange: [CreateTransactionStore, LabelStore, TransactionStore]
    },
    willTransitionFrom(transition, component) {
      component._clearUnsavedData();
    }
  },
  getInitialState() {
    return this._getStateFromStores();
  },
  _getStateFromStores() {
    return {
      transaction: this.getStore(TransactionStore).getTransaction(this._getTransactionId()) || {},
      labels: this.getStore(LabelStore).getLabels(),
      lineItems: []
    }
  },
  componentWillReceiveProps() {
    this.setState(this.getInitialState());
    this._loadTransaction();
  },
  _getTransactionId() {
    return parseInt(this.getParams().id) || null;
  },
  _onChange() {
    this.setState(this._getStateFromStores());
  },
  _loadTransaction() {
    let transactionId = this._getTransactionId();

    if (transactionId !== null) {
      this.props.context.executeAction(showTransactionsAction, {id: transactionId});
    }
  },
  componentDidMount() {
    this.props.context.executeAction(showLabelsAction);
    this._loadTransaction();
  },
  render() {
    let errorMessage = null;

    if (this.state.hasErrors) {
      errorMessage = (
        <Alert bsStyle="danger">
          <strong>There were problems creating transaction</strong>
        </Alert>
      );
    }

    let transaction = this.state.transaction;

    return (
      <div>
        <h1>Update Transaction</h1>
        {errorMessage}
        <TransactionForm ref="transactionForm" transaction={transaction.pendingData || transaction}
                         disabled={transaction.pending} />
        <Input type="submit" bsStyle="primary" onClick={this._onSubmit} disabled={this.state.working}
               value={transaction.pending ? 'Working...' : 'Save'}
        />
        <TransactionItemsForm ref="lineItemsForm" lineItems={transaction.lineItems} onChange={this._onLineItemsChange}
                              labels={this.state.labels} />

      </div>
    );
  },
  _onSubmit(e) {
    e.preventDefault();

    let result = this.refs.transactionForm.validate();

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

    this.props.context.executeAction(createTransactionAction, result.data);
  },
  _clearUnsavedData() {
    this.props.context.executeAction(clearUnsavedTransactionAction);
  }
});