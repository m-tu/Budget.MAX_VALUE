'use strict';

var createStore = require('fluxible/utils/createStore');
var objectAssign = require('object-assign');

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

    var oldTransaction = this.getTransaction(transaction.id);

    if (oldTransaction) {
      objectAssign(oldTransaction, transaction);
    } else {
      this.transactions.push(transaction);
    }

    this.emitChange();
  },
  getAll: function () {
    return this.transactions;
  },
  getTransaction: function(id) {
    var i;
    var transaction;

    for (i = 0; i < this.transactions.length; i++) {
      transaction = this.transactions[i];

      if (transaction.id === id) {
        return transaction;
      }
    }

    return null;
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