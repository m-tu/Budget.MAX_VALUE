'use strict';

var React = require('react/addons');
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var cx = React.addons.classSet;
var loadGooglePickerAction = require('../actions/loadGooglePicker');

var FileSelector = React.createClass({
  _dragEnterDocumentCount: 0,
  _dragEnterDropZoneCount: 0,
  _nextFileId: 0,
  getInitialState: function () {
    return {
      dragActive: false,
      dragInZone: false,
      files: []
    };
  },
  componentDidMount: function() {
    document.addEventListener('dragenter', this._onDragEnterDocument);
    document.addEventListener('dragleave', this._onDragLeaveDocument);
    document.addEventListener('dragover', this._onDragOver);
  },
  componentWillUnmount: function() {
    document.removeEventListener('dragenter', this._onDragEnterDocument);
    document.removeEventListener('dragleave', this._onDragLeaveDocument);
    document.removeEventListener('dragover', this._onDragOver);
  },
  getFiles: function() {
    return this.state.files.slice(0);
  },
  render: function() {
    var dropZoneClasses = cx({
      dropzone: true,
      visible: this.state.dragActive,
      active: this.state.dragInZone
    });

    var dropZoneMessage = this.state.dragActive ? 'Drop here' : 'or drag here';

    return (
      <div>
        <Button onClick={this._openGooglePicker}>Choose files from google drive</Button>
        <input ref="file" type="file" multiple className="hidden" onChange={this._onFilesSelected} />
        <div className={dropZoneClasses}
          onDragLeave={this._onDragLeave} onDragEnter={this._onDragEnter} onDrop={this._onDrop}
        >
          <Button onClick={this._onSelectFile}>
            Browse files
          </Button>
          <p>
            {dropZoneMessage}
          </p>
        </div>
            {this._renderFilesList()}
      </div>
    );
  },
  _openGooglePicker: function() {
    this.props.context.executeAction(loadGooglePickerAction, {open: true});
  },
  _renderFilesList: function() {
    return (
      this.state.files.length === 0
        ? null :
        <div className="fileList">
          {this.state.files.map(this._renderFile)}
        </div>
    );
  },
  _renderFile: function(file) {
    var classes = cx({
      file: true,
      placeholder: !file._dataUrl
    });

    var fileElement = file._dataUrl ? <img src={file._dataUrl} title={file.name} /> : file.name;

    return (
      <div key={file._id} className={classes}>
        {fileElement}
        <Glyphicon glyph="remove" className="text-danger" onClick={this._onRemoveFile.bind(this, file)} />
      </div>
    );
  },
  _onRemoveFile: function(file) {
    var index = this.state.files.indexOf(file);

    if (index !== -1) {
      this.setState({
        files: React.addons.update(this.state.files, {
          $splice: [
            [index, 1]
          ]
        })
      });
    }
  },
  _onDragEnterDocument: function() {
    this._dragEnterDocumentCount++;

    if (!this.state.dragActive) {
      this.setState({
        dragActive: true
      });
    }
  },
  _onDragLeaveDocument: function() {
    this._dragEnterDocumentCount--;

    if (this._dragEnterDocumentCount === 0) {
      // user cancelled dragging
      this._endDrag();
    }
  },
  _onDragOver: function(e) {
    e.preventDefault(); // so we can drop file

    // only place where we can update dropEffect
    e.dataTransfer.dropEffect = this.state.dragInZone > 0 ? 'copy' : 'none';
  },
  _onDragEnter: function() {
    this._dragEnterDropZoneCount++;

    if (!this.state.dragInZone) {
      this.setState({
        dragInZone: true
      })
    }
  },
  _onDragLeave: function() {
    this._dragEnterDropZoneCount--;

    if (this._dragEnterDropZoneCount === 0) {
      this.setState({
        dragInZone: false
      });
    }
  },
  _onDrop: function(e) {
    e.preventDefault(); // prevent browser default action

    this._endDrag(this.state.files);
    this._addFiles(e.dataTransfer.files);
  },
  _onSelectFile: function() {
    this.refs.file.getDOMNode().click();
  },
  _onFilesSelected: function(e) {
    this._addFiles(e.target.files);
    e.target.value = null;
  },
  _endDrag: function() {
    this._dragEnterDocumentCount = 0;
    this._dragEnterDropZoneCount = 0;

    this.setState({
      dragActive: false,
      dragInZone: false
    });
  },
  /**
   *
   * @param {FileList} files
   * @private
   */
  _addFiles: function(files) {
    var filesArray = Array.prototype.slice.call(files);

    filesArray.forEach(function(file) {
      file._id = this._nextFileId++;

      this._loadImage(file);
    }.bind(this));

    this.setState({
      files: React.addons.update(this.state.files, {
        $push : filesArray
      })
    });
  },
  _loadImage: function(file) {
    if (!/image.*/.test(file.type)) {
      return;
    }

    var reader = new FileReader();

    reader.onload = function(e) {
      file._dataUrl = e.target.result;

      console.log(file._dataUrl);

      this.setState({
        files: this.state.files
      });
    }.bind(this);

    reader.readAsDataURL(file);
  }
});

module.exports = FileSelector;