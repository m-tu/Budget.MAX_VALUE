'use strict';

var createStore = require('fluxible-app/utils/createStore');

module.exports = createStore({
  storeName: 'TransactionStore',
  handlers: {
    RECEIVE_TRANSACTIONS_SUCCESS: '_receiveTransactions',
    CREATE_TRANSACTION_DONE: '_createTransaction'
  },
  initialize: function () {
    this.transactions = [];
    this.populated = false;
  },
  _receiveTransactions: function(transactions) {
    this.rehydrate({
      transactions: transactions,
      populated: true
    });

    this.emitChange();
  },
  _createTransaction: function(transaction) {
    transaction.date = new Date(transaction.date);

    this.transactions.push(transaction);
    this.emitChange();
  },
  getAll: function () {
    return this.transactions;
  },
  isPopulated: function() {
    return this.populated;
  },
  dehydrate: function () {
    return {
      transactions: this.transactions,
      populated: this.populated
    };
  },
  rehydrate: function (state) {
    this.transactions = state.transactions;
    state.transactions.forEach(function(transaction) {
      transaction.date = new Date(transaction.date);
    });

    this.populated = state.populated;
  }
});