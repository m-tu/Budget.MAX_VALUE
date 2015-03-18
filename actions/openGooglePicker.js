'use strict';

import googleApiUtil from '../utils/googleApi';
// TODO test
export default async function(context) {
  try {
    let files = googleApiUtil.openPicker();
    context.dispatch('GOOGLE_PICKER_FILES_ADDED', files);
  } catch (err) {
    console.log('picker failed', err);
  }
  //googleApiUtil.openPicker().then((files) => {
  //  context.dispatch('GOOGLE_PICKER_FILES_ADDED', files);
  //}).catch((err) => {
  //  console.log('picker failed', err);
  //});
};
