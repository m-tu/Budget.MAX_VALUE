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
  initialize() {
    this.transactions = [];
    this.populated = false;
  },
  _receiveTransactions(transactions) {
    this.rehydrate({
      transactions: transactions,
      populated: true
    });

    this.emitChange();
  },
  _receiveTransaction(transaction) {
    let newTransaction = this._formatRawTransaction(transaction);
    let oldIndex = this.getTransactionIndex(newTransaction.id);

    if (oldIndex === -1) {
      this.transactions.push(newTransaction);
    } else {
      this.transactions.splice(oldIndex, 1, newTransaction);
    }
    this.emitChange();
  },
  _updateTransactionStart(transaction) {
    let oldTransaction = this.getTransaction(transaction.id);

    if (oldTransaction) {
      oldTransaction.pending = true;
      oldTransaction.pendingData = transaction;
      this.emitChange();
    }
  },
  _updateTransaction(transaction) {
    this._receiveTransaction(transaction);
  },
  _updateTransactionFail(transaction) {
    // TODO check if transaction exists in store
    transaction.pending = false;
    // TODO save errors
  },
  _clearUnsavedData(transaction) {
    // TODO check if transaction exists in store
    if (!transaction.pending) {
      transaction.pendingData = null;
      this.emitChange();
    }
  },
  hasTransaction(id) {
    return this.transactions.some((transaction) => transaction.id === id);
  },
  getAll() {
    return this.transactions;
  },

  getTransactionIndex(id) {
    return this.transactions.findIndex((transaction) => transaction.id === id);
  },
  getTransaction(id) {
    let index = this.getTransactionIndex(id);

    return index === -1 ? null : this.transactions[index];
  },
  isPopulated() {
    return this.populated;
  },
  _formatRawTransaction(transaction) {
    return Object.assign(transaction, {
      date: new Date(transaction.date),
      pending: false,
      pendingData: null
    });
  },
  dehydrate() {
    return {
      transactions: this.transactions,
      populated: this.populated
    };
  },
  rehydrate(state) {
    this.transactions = state.transactions.map(this._formatRawTransaction);

    this.populated = state.populated;
  }
});