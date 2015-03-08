'use strict';

import createStore from 'fluxible/utils/createStore';

export default createStore({
  storeName: 'TransactionStore',
  handlers: {
    RECEIVE_TRANSACTION_SUCCESS: '_receiveTransaction',
    RECEIVE_TRANSACTIONS_SUCCESS: '_receiveTransactions',
    UPDATE_TRANSACTION_START: '_updateTransactionStart',
    UPDATE_TRANSACTION_DONE: '_updateTransaction',
    UPDATE_TRANSACTION_FAIL: '_updateTransactionFail',
    CLEAR_UNSAVED_TRANSACTION: '_clearUnsavedData'
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
      this.transactions.splice(oldIndex, 1, newTransaction);
    }
    this.emitChange();
  },
  _updateTransactionStart: function(transaction) {
    var oldTransaction = this.getTransaction(transaction.id);

    if (oldTransaction) {
      oldTransaction.pending = true;
      oldTransaction.pendingData = transaction;
      this.emitChange();
    }
  },
  _updateTransaction: function(transaction) {
    this._receiveTransaction(transaction);
  },
  _updateTransactionFail: function(transaction, errors) {
    // TODO check if transaction exists in store
    transaction.pending = false;
    // TODO save errors
  },
  _clearUnsavedData: function(transaction) {
    // TODO check if transaction exists in store
    if (!transaction.pending) {
      transaction.pendingData = null;
      this.emitChange();
    }
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
    transaction.pending = false;
    transaction.pendingData = null;

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