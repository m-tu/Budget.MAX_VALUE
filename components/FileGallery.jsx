'use strict';

var React = require('react/addons');
var CreateTransactionStore = require('../stores/CreateTransactionStore');
var StoreMixin = require('fluxible').StoreMixin;
var ReactBootstrap = require('react-bootstrap');
var Glyphicon = ReactBootstrap.Glyphicon;
var cx = React.addons.classSet;

var FileGallery = React.createClass({
  mixins: [StoreMixin],
  statics: {
    storeListeners: {
      _onChange: [CreateTransactionStore]
    }
  },
  getInitialState: function() {
    return {
      files: this.getStore(CreateTransactionStore).getFiles()
    };
  },
  _onChange: function() {
    this.setState(this.getInitialState());
  },
  render: function() {
    return (
      this.state.files.length === 0
        ? null :
        <div className="fileList">
          {this.state.files.map(this._renderFile)}
        </div>
    );
  },
  _renderFile: function(file) {
    var hasThumbnail = !!file.thumbnailLink;
    var viewUrl = file.embedLink || file.alternateLink; // TODO use webcontentLink and img tag
    var classes = cx({
      file: true,
      placeholder: !hasThumbnail
    });

    var fileElement = hasThumbnail ? <img src={file.thumbnailLink} title={file.title} /> : file.title;

    return (
      <div key={file.id} className={classes}>
        <a href={viewUrl} target="_blank">
          {fileElement}
          <Glyphicon glyph="remove" className="text-danger" onClick={this._onRemoveFile.bind(this, file)} />
        </a>
      </div>
    );
  },
  _onRemoveFile: function(file, event) {
    event.preventDefault();
    // TODO implement
  }
});

module.exports = FileGallery;