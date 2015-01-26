'use strict';

var googleApiUtil = require('../utils/googleApi');

module.exports = function(context, payload) {
  if (!payload.open) {
    context.dispatch('GOOGLE_API_LOADED');
    return
  }

  googleApiUtil.openPicker().then(function(files) {
    // TODO call action
    console.log('FILES', files);
  }).catch(function(err) {
    // TODO catch errors
    console.log('error', err)
  });
};
