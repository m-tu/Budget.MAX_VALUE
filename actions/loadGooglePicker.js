'use strict';

/*global window, gapi, google */
var API_KEY = 'AIzaSyBLxnn2Y2IqVWCj0vLtXOZzHlMaxB0Iw8E';
var CLIENT_ID = '296834620179-tp0br8ov1ghhdfkilnrp0h32eab72dt7.apps.googleusercontent.com';

// TODO save results, refactor
function pickerCallback(data) {
  var docs = [];
  if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
    docs = data[google.picker.Response.DOCUMENTS];
  }

  console.log('you picked', docs)
}

function openDialog(accessToken) {
  var picker = new google.picker.PickerBuilder()
    .addView(new google.picker.DocsUploadView())
    .addView(new google.picker.DocsView())
    .setOAuthToken(accessToken)
    .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
    .setDeveloperKey(API_KEY)
    .setCallback(pickerCallback)
    .build();

  picker.setVisible(true);
}

module.exports = function(context, payload) {
  if (!payload.open) {
    context.dispatch('GOOGLE_API_LOADED');
    return
  }

  window.gapi.load('auth', function() {
    window.gapi.auth.authorize({
      'client_id': CLIENT_ID,
      'scope': ['https://www.googleapis.com/auth/drive.file']
    }, function(result) {
      var accessToken;

      if (result && !result.error) {
        accessToken = result.access_token;
        openDialog(accessToken);
      }
      console.log('auth result', result)
    })
  });
  window.gapi.load('picker');
};
