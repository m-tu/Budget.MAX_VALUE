'use strict';

var googleApiUtil = require('../utils/googleApi');

module.exports = function(context) {
  googleApiUtil.openPicker().then(function(files) {
    context.dispatch('GOOGLE_PICKER_FILES_ADDED', files);
  });
};
