'use strict';

var React = require('react/addons');
var CreateTransactionStore = require('../stores/CreateTransactionStore');
var StoreMixin = require('fluxible').StoreMixin;

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
      <div>
        {this.state.files.map(this._renderFile)}
      </div>
    )
  },
  _renderFile: function(file, index) {
    return <p key={file.id}>{index + 1}. {file.title}</p>;
  }
});

module.exports = FileGallery;