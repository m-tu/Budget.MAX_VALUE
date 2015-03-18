'use strict';

import React from 'react';
import AuthMixin from '../mixins/Auth';

import { FluxibleMixin } from 'fluxible';
import { LabelStore } from '../stores';
import { showLabelsAction, createTransactionAction } from '../actions';
import { Alert, Button } from 'react-bootstrap';

import TransactionForm from '../components/TransactionForm.jsx';
import TransactionItemsForm from '../components/TransactionItemsForm.jsx';


export default React.createClass({
  propTypes: {
    context: React.PropTypes.object.isRequired
  },
  mixins: [AuthMixin, FluxibleMixin],
  statics: {
    storeListeners: [LabelStore]
  },
  componentDidMount() {
    this.props.context.executeAction(showLabelsAction);
  },
  getInitialState() {
    return Object.assign({
      lineItems: [],
      hasErrors: false
    }, this._getStateFromStores());
  },
  _getStateFromStores() {
    return {
      labels: this.getStore(LabelStore).getLabels()
    }
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

    return (
      <div>
        <h1>Create Transaction</h1>
        {errorMessage}
        <TransactionForm key="test" ref="transactionForm" />
        <TransactionItemsForm ref="lineItemsForm" lineItems={this.state.lineItems} onChange={this._onLineItemsChange}
                              labels={this.state.labels} />
        <Button type="submit" bsStyle="success" onClick={this._onSubmit} disabled={this.state.working}>
          {this.state.working ? 'Working...' : 'Create'}
        </Button>
      </div>
    );
  },
  _onSubmit(e) {
    e.preventDefault();

    let transactionValidation = this.refs.transactionForm.validate();
    let itemsValidation = this.refs.lineItemsForm.validate();

    if (transactionValidation.hasErrors || itemsValidation.hasErrors) {
      this.setState({
        hasErrors: true
      });
    } else {
      let transaction = transactionValidation.data;

      transaction.lineItems = this.state.lineItems.map(item => {
        return {
          name: item.name,
          amount: item.amount,
          labels: item.labels.map(label => {
            return label.id;
          })
        };
      });

      this.props.context.executeAction(createTransactionAction, transaction);

      // TODO get working state and unsuccessful creation errors form store
      this.setState({
        working: true
      });
    }
  },
  _onLineItemsChange(newLineItems) {
    this.setState({
      lineItems: newLineItems
    });
  },
  onChange() {
    this.setState(this._getStateFromStores());
  }
});