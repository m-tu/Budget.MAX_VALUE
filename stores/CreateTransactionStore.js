'use strict';

import createStore from 'fluxible/utils/createStore';

export default createStore({
  storeName: 'CreateTransactionStore',
  handlers: {
    'GOOGLE_PICKER_FILES_ADDED': '_googlePickerFilesAdded'
  },
  initialize() {
    this.transaction = {};
    this.files = [];
  },
  _googlePickerFilesAdded(files) {
    let existingIds = this.files.map((file) => {
      return file.id;
    });

    for (let file of files) {
      if (existingIds.indexOf(file.id) === -1) {
        this.files.push(file);
      }
    }

    this.emitChange();
  },
  getFiles() {
    return this.files;
  }
});