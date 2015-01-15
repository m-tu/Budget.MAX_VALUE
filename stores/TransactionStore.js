'use strict';

var createStore = require('fluxible-app/utils/createStore');

module.exports = createStore({
  storeName: 'TransactionStore',
  handlers: {
    RECEIVE_TRANSACTIONS_SUCCESS: '_receiveTransactions'
  },
  initialize: function () {
    this.transactions = [];
  },
  _receiveTransactions: function(transactions) {
    this.rehydrate({
      transactions: transactions
    });

    this.emitChange();
  },
  getAll: function () {
    return this.transactions;
  },
  dehydrate: function () {
    return {
      transactions: this.transactions
    };
  },
  rehydrate: function (state) {
    this.transactions = state.transactions;
    state.transactions.forEach(function(transaction) {
      transaction.date = new Date(transaction.date);
    });
  }
});