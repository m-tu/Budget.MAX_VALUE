'use strict';

var React = require('react/addons');
var Router = require('react-router');
var TransactionStore = require('../stores/TransactionStore');
var FluxibleMixin = require('fluxible').Mixin;
var FileGallery = require('../components/FileGallery.jsx');
var showTransactions = require('../actions/showTransactions');

var AuthMixin = require('../mixins/Auth');

var Link = Router.Link;

var Transactions = React.createClass({
  mixins: [AuthMixin, FluxibleMixin],
  statics: {
    storeListeners: {
      _onChange: [TransactionStore]
    }
  },
  getInitialState: function() {
    return {
      transactions: this.getStore(TransactionStore).getAll()
    };
  },
  componentDidMount: function() {
    this.props.context.executeAction(showTransactions);
  },
  _onChange: function() {
    this.setState(this.getInitialState());
  },
  render: function() {
    var transactions = this.state.transactions.map(function(transaction) {
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
          <td><FileGallery files={transaction.files} /></td>
        </tr>
      );
    }.bind(this));

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
            <th>Files</th>
          </tr>
          {transactions}
        </tbody>
      </table>
    );
  }
});

module.exports = Transactions;