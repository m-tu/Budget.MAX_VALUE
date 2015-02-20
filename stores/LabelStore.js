'use strict';
var createStore = require('fluxible/utils/createStore');

module.exports = createStore({
  storeName: 'LabelStore',
  handlers: {
    UPDATE_LABEL: '_updateLabel',
    DELETE_LABEL: '_deleteLabel'
  },
  initialize: function () {
    this.labels = [{
      id: 1,
      name: 'nigger'
    }];
  },
  _updateLabel: function(label) {
    var existingLabel = label.id ? this.getLabelById(label.id) : null;

    if (existingLabel) {
      existingLabel.name = label.name;
    } else {
      this.labels.push(label);
    }
    this.emitChange();
  },
  _deleteLabel: function(label) {
    var index = this.getLabelIndexById(label.id);

    if (index !== -1) {
      this.labels.splice(index, 1);
    }
    this.emitChange();
  },
  _receiveLabels: function(labels) {
    this.labels = labels;
    this.emitChange();
  },
  _createUser: function(user) {
    this.users.push(user);
    this.emitChange();
  },
  getLabels: function () {
    return this.labels;
  },
  getLabelIndexById: function(id) {
    var i;

    for (i = 0; i < this.labels.length; i++) {
      if (this.labels[i].id === id) {
        return i;
      }
    }

    return -1;
  },
  getLabelById: function(id) {
    var index = this.getLabelIndexById(id);

    return index === -1 ? null : this.labels[index];
  },
  dehydrate: function () {
    return {
      labels: this.labels
    };
  },
  rehydrate: function (state) {
    this.labels = state.labels;
  }
});