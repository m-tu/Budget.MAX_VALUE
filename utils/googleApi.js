'use strict';

let API_KEY = 'AIzaSyBLxnn2Y2IqVWCj0vLtXOZzHlMaxB0Iw8E';
let CLIENT_ID = '296834620179-tp0br8ov1ghhdfkilnrp0h32eab72dt7.apps.googleusercontent.com';

export default {
  _loaded: false,
  _accessToken: null,
  async openPicker() {
    if (!this._loaded) {
      await this._load();
    }
    if (!this._accessToken) {
      await this._requestAccessToken();
    }

    // TODO check if token is valid, it might time out

    let files = await this._onFilesPicked();

    // get files metadata
    return await* files.map(this._getFileMetaData());
  },
  async _onFilesPicked() {
    let data = await this._openDialog();
    let action = data[google.picker.Response.ACTION];


    if (action === google.picker.Action.PICKED) {
      return data[google.picker.Response.DOCUMENTS];
    } else if (action === google.picker.Action.CANCEL) {
      throw new Error('user cancelled picking');
    } else {
      return [];
    }
  },
  async _requestAccessToken() {
    let accessToken;

    try {
      accessToken = await this._authorize(true);
    } catch (err) {
      accessToken = await this._authorize(false);
    }

    this._accessToken = accessToken;
  },
  async _getFileMetaData(file) {
    let data = await window.gapi.client.drive.files.get({fileId: file.id});

    return data.result;
  },
  _openDialog() {
    return new Promise((resolve) => {
      var picker = new google.picker.PickerBuilder()
        .addView(new google.picker.DocsUploadView())
        .addView(new google.picker.DocsView())
        .setOAuthToken(this._accessToken)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setDeveloperKey(API_KEY)
        .setAppId(CLIENT_ID.split('-')[0])
        .setCallback(resolve)
        .build();

      picker.setVisible(true);
    });
  },
  _load() {
    return new Promise((resolve) => {
      window.gapi.client.load('drive', 'v2', resolve);
      window.gapi.load('picker');
    }).then(() => { this._loaded = true; });
  },
  _authorize(immediateMode) {
    return new Promise((resolve, reject) => {
      window.gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: ['https://www.googleapis.com/auth/drive.file'],
        immediate: immediateMode
      }, function(result) {
        if (result && !result.error) {
          resolve(result.access_token);
        } else {
          reject(new Error('no access token'));
        }
      });
    });
  },
  getAccessToken() {
    return this._accessToken;
  }
};