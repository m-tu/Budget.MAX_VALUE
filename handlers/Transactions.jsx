'use strict';

import React from 'react/addons';
import { Link } from 'react-router';
import { TransactionStore } from '../stores';
import { FluxibleMixin } from 'fluxible';
import { showTransactionsAction } from '../actions';

import AuthMixin from '../mixins/Auth';

export default React.createClass({
  mixins: [AuthMixin, FluxibleMixin],
  statics: {
    storeListeners: {
      _onChange: [TransactionStore]
    }
  },
  getInitialState() {
    return {
      transactions: this.getStore(TransactionStore).getAll()
    };
  },
  componentDidMount() {
    this.props.context.executeAction(showTransactionsAction);
  },
  _onChange() {
    this.setState(this.getInitialState());
  },
  render() {
    let transactions = this.state.transactions.map(transaction => {
      return (
        <tr key={transaction.id}>
          <td>
            <Link to="updateTransaction" params={{id: transaction.id}}>
              {transaction.id}
            </Link>
          </td>
          <td>{transaction.date.toString()}</td>
          <td>{transaction.description}</td>
          <td>{transaction.location}</td>
          <td>{transaction.amount}</td>
          <td>{transaction.method}</td>
        </tr>
      );
    });

    return (
      <table className="table table-striped table-bordered table-hover">
        <tbody>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th>Description</th>
            <th>Location</th>
            <th>Amount</th>
            <th>Payment method</th>
          </tr>
          {transactions}
        </tbody>
      </table>
    );
  }
});