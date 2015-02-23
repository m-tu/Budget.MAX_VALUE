'use strict';

var createStore = require('fluxible/utils/createStore');
var objectAssign = require('object-assign');

module.exports = createStore({
  storeName: 'TransactionStore',
  handlers: {
    RECEIVE_TRANSACTION_SUCCESS: '_receiveTransaction',
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
  _receiveTransaction: function(transaction) {
    var newTransaction = this._formatRawTransaction(transaction);
    var oldIndex = this.getTransactionIndex(newTransaction.id);

    if (oldIndex === -1) {
      this.transactions.push(newTransaction);
    } else {
      this.transactions.splice(index, 1, [newTransaction]);
    }
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
  hasTransaction: function(id) {
    return this.transactions.some(function(transaction) {
      return transaction.id === id;
    });
  },
  getAll: function () {
    return this.transactions;
  },
  getTransactionIndex: function(id) {
    var i;

    for (i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].id === id) {
        return i;
      }
    }

    return -1;
  },
  getTransaction: function(id) {
    var index = this.getTransactionIndex(id);

    return index === -1 ? null : this.transactions[index];
  },
  isPopulated: function() {
    return this.populated;
  },
  _formatRawTransaction: function(transaction) {
    transaction.date = new Date(transaction.date);

    return transaction;
  },
  dehydrate: function () {
    return {
      transactions: this.transactions,
      populated: this.populated
    };
  },
  rehydrate: function (state) {
    this.transactions = state.transactions.map(this._formatRawTransaction);

    this.populated = state.populated;
  }
});