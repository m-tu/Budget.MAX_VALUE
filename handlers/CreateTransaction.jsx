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
  componentDidMount: function() {
    this.props.context.executeAction(showLabelsAction);
  },
  getInitialState: function() {
    return Object.assign({
      lineItems: [],
      hasErrors: false
    }, this._getStateFromStores());
  },
  _getStateFromStores: function() {
    return {
      labels: this.getStore(LabelStore).getLabels()
    }
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
        <h1>Create Transaction</h1>
        {errorMessage}
        <TransactionForm ref="transactionForm" transaction={{}}/>
        <TransactionItemsForm ref="lineItemsForm" lineItems={this.state.lineItems} onChange={this._onLineItemsChange}
                              labels={this.state.labels} />
        <Button type="submit" bsStyle="success" onClick={this._onSubmit} disabled={this.state.working}>
          {this.state.working ? 'Working...' : 'Create'}
        </Button>
      </div>
    );
  },
  _onSubmit: function(e) {
    e.preventDefault();

    var transactionValidation = this.refs.transactionForm.validate();
    var itemsValidation = this.refs.lineItemsForm.validate();

    if (transactionValidation.hasErrors || itemsValidation.hasErrors) {
      this.setState({
        hasErrors: true
      });
    } else {
      var transaction = transactionValidation.data;

      transaction.lineItems = this.state.lineItems.map(function(item) {
        var lineItem = Object.assign({}, item);

        lineItem.id = null;
        lineItem.labels = lineItem.labels.map(function(label) {
          return label.id;
        });

        return lineItem;
      });

      this.props.context.executeAction(createTransactionAction, transaction);

      // TODO get working state and unsuccessful creation errors form store
      this.setState({
        working: true
      });
    }
  },
  _onLineItemsChange: function(newLineItems) {
    this.setState({
      lineItems: newLineItems
    });
  },
  onChange: function() {
    this.setState(this._getStateFromStores());
  }
});