'use strict';

import { createStore } from 'fluxible/addons';

export default createStore({
  storeName: 'LabelStore',
  handlers: {
    RECEIVE_LABELS_DONE: '_receiveLabels',
    UPDATE_LABEL: '_updateLabel',
    DELETE_LABEL: '_deleteLabel'
  },
  initialize() {
    this.labels = [];
  },
  _updateLabel(label) {
    let existingLabel = label.id ? this.getLabelById(label.id) : null;

    if (existingLabel) {
      existingLabel.name = label.name;
    } else {
      this.labels.push(label);
    }
    this.emitChange();
  },
  _deleteLabel(label) {
    let index = this.getLabelIndexById(label.id);

    if (index !== -1) {
      this.labels.splice(index, 1);
    }
    this.emitChange();
  },
  _receiveLabels(labels) {
    this.labels = labels;
    this.emitChange();
  },
  _createUser(user) {
    this.users.push(user);
    this.emitChange();
  },
  getLabels: function () {
    return this.labels;
  },
  getLabelIndexById(id) {
    return this.labels.findIndex((label) => label.id === id);
  },
  getLabelById(id) {
    let index = this.getLabelIndexById(id);

    return index === -1 ? null : this.labels[index];
  },
  dehydrate() {
    return {
      labels: this.labels
    };
  },
  rehydrate(state) {
    this.labels = state.labels;
  }
});