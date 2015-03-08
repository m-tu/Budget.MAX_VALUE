'use strict';

import googleApiUtil from '../utils/googleApi';

export default function(context) {
  googleApiUtil.openPicker().then(function(files) {
    context.dispatch('GOOGLE_PICKER_FILES_ADDED', files);
  }).catch(function(err) {
    console.log('picker failed', err);
  });
};
