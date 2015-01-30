'use strict';

var createStore = require('fluxible/utils/createStore');

module.exports = createStore({
  storeName: 'CreateTransactionStore',
  handlers: {
    'GOOGLE_PICKER_FILES_ADDED': '_googlePickerFilesAdded'
  },
  initialize: function () {
    this.transaction = {};
    this.files = [];
  },
  _googlePickerFilesAdded: function(files) {
    var existingIds = this.files.map(function(file) {
      return file.id;
    });

    files.forEach(function(file) {
      if (existingIds.indexOf(file.id) === -1) {
        this.files.push(file);
      }
    }.bind(this));

    this.emitChange();
  },
  getFiles: function() {
    return this.files;
  }
});