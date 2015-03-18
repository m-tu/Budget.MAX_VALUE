'use strict';

import React from 'react/addons';
import { Button, Glyphicon } from 'react-bootstrap';
import classnames from 'classnames';

/**
 *
 * @type {*|Function}
 */
export default React.createClass({
  _dragEnterDocumentCount: 0,
  _dragEnterDropZoneCount: 0,
  _nextFileId: 0,
  getInitialState() {
    return {
      dragActive: false,
      dragInZone: false,
      files: []
    };
  },
  componentDidMount() {
    document.addEventListener('dragenter', this._onDragEnterDocument);
    document.addEventListener('dragleave', this._onDragLeaveDocument);
    document.addEventListener('dragover', this._onDragOver);
  },
  componentWillUnmount() {
    document.removeEventListener('dragenter', this._onDragEnterDocument);
    document.removeEventListener('dragleave', this._onDragLeaveDocument);
    document.removeEventListener('dragover', this._onDragOver);
  },
  getFiles() {
    return this.state.files.slice(0);
  },
  render: function() {
    let dropZoneClasses = classnames({
      dropzone: true,
      visible: this.state.dragActive,
      active: this.state.dragInZone
    });

    let dropZoneMessage = this.state.dragActive ? 'Drop here' : 'or drag here';

    return (
      <div>
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
  _renderFilesList() {
    return (
      this.state.files.length === 0
        ? null :
        <div className="fileList">
          {this.state.files.map(this._renderFile)}
        </div>
    );
  },
  _renderFile(file) {
    let classes = classnames({
      file: true,
      placeholder: !file._dataUrl
    });

    let fileElement = file._dataUrl ? <img src={file._dataUrl} title={file.name} /> : file.name;

    return (
      <div key={file._id} className={classes}>
        {fileElement}
        <Glyphicon glyph="remove" className="text-danger" onClick={this._onRemoveFile.bind(null, file)} />
      </div>
    );
  },
  _onRemoveFile(file) {
    let index = this.state.files.indexOf(file);

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
  _onDragEnterDocument() {
    this._dragEnterDocumentCount++;

    if (!this.state.dragActive) {
      this.setState({
        dragActive: true
      });
    }
  },
  _onDragLeaveDocument() {
    this._dragEnterDocumentCount--;

    if (this._dragEnterDocumentCount === 0) {
      // user cancelled dragging
      this._endDrag();
    }
  },
  _onDragOver(e) {
    e.preventDefault(); // so we can drop file

    // only place where we can update dropEffect
    e.dataTransfer.dropEffect = this.state.dragInZone > 0 ? 'copy' : 'none';
  },
  _onDragEnter() {
    this._dragEnterDropZoneCount++;

    if (!this.state.dragInZone) {
      this.setState({
        dragInZone: true
      })
    }
  },
  _onDragLeave() {
    this._dragEnterDropZoneCount--;

    if (this._dragEnterDropZoneCount === 0) {
      this.setState({
        dragInZone: false
      });
    }
  },
  _onDrop(e) {
    e.preventDefault(); // prevent browser default action

    this._endDrag(this.state.files);
    this._addFiles(e.dataTransfer.files);
  },
  _onSelectFile() {
    this.refs.file.getDOMNode().click();
  },
  _onFilesSelected(e) {
    this._addFiles(e.target.files);
    e.target.value = null;
  },
  _endDrag() {
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
  _addFiles(files) {
    let filesArray = Array.prototype.slice.call(files);

    filesArray.forEach((file) => {
      file._id = this._nextFileId++;

      this._loadImage(file);
    });

    this.setState({
      files: React.addons.update(this.state.files, {
        $push : filesArray
      })
    });
  },
  _loadImage(file) {
    if (!/image.*/.test(file.type)) {
      return;
    }

    let reader = new FileReader();

    reader.onload = (e) => {
      file._dataUrl = e.target.result;

      console.log(file._dataUrl);

      this.setState({
        files: this.state.files
      });
    };

    reader.readAsDataURL(file);
  }
});