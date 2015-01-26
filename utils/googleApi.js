'use strict';
/*global window, gapi, google */

var Promise = require('es6-promise').Promise;
var API_KEY = 'AIzaSyBLxnn2Y2IqVWCj0vLtXOZzHlMaxB0Iw8E';
var CLIENT_ID = '296834620179-tp0br8ov1ghhdfkilnrp0h32eab72dt7.apps.googleusercontent.com';

var googleApiUtil = {
  _loaded: false,
  _accessToken: null,
  openPicker: function() {
    if (this._accessToken !== null) {
      // TODO check if token is valid, it might time out
      return this._openDialog();
    } else if (this._loaded) {
      return this._requestAccessToken().then(this._openDialog.bind(this));
    } else {
      return this._load().then(this._requestAccessToken.bind(this)).then(this._openDialog.bind(this));
    }
  },
  _load: function() {
    return new Promise(function(resolve) {
      window.gapi.load('auth', resolve);
      window.gapi.load('picker');
    }.bind(this))
      .then(function() {
        this._loaded = true;
      }.bind(this));
  },
  _onFilesPicked: function(resolve, reject, data) {
    var action = data[google.picker.Response.ACTION];


    if (action === google.picker.Action.PICKED) {
      resolve(data[google.picker.Response.DOCUMENTS]);
    } else if (action === google.picker.Action.CANCEL) {
      reject(new Error('user cancelled picking'));
    }
  },
  _requestAccessToken: function() {
    return this._authorize(true)
      .then(null, function() {
        return this._authorize(false);
      }.bind(this))
      .then(function(accessToken) {
        this._accessToken = accessToken;
      }.bind(this))
  },
  _openDialog: function() {
    return new Promise(function(resolve, reject) {
      var picker = new google.picker.PickerBuilder()
        .addView(new google.picker.DocsUploadView())
        .addView(new google.picker.DocsView())
        .setOAuthToken(this._accessToken)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setDeveloperKey(API_KEY)
        .setCallback(this._onFilesPicked.bind(this, resolve, reject))
        .build();

      picker.setVisible(true);
    }.bind(this));
  },
  _authorize: function(immediateMode) {
    return new Promise(function(resolve, reject) {
      window.gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': ['https://www.googleapis.com/auth/drive.file'],
        'immediate': immediateMode
      }, function(result) {
        if (result && !result.error) {
          resolve(result.access_token);
        } else {
          reject(new Error('no access token'));
        }
      });
    });
  }
};

module.exports = googleApiUtil;