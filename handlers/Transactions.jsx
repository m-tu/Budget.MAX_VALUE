'use strict';

var React = require('react/addons');
var TransactionStore = require('../stores/TransactionStore');
var StoreMixin = require('fluxible').StoreMixin;
var FileGallery = require('../components/FileGallery.jsx');
var NavLink = require('flux-router-component').NavLink;

var Transactions = React.createClass({
  mixins: [StoreMixin],
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
  _onChange: function() {
    this.setState(this.getInitialState());
  },
  render: function() {
    var transactions = this.state.transactions.map(function(transaction) {
      return (
        <tr key={transaction.id}>
          <td>
            <NavLink routeName="updateTransaction" navParams={{id: transaction.id}} context={this.props.context}>
              {transaction.id}
            </NavLink>
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