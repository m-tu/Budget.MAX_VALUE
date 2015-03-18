'use strict';

import React from 'react/addons';
import { Glyphicon } from 'react-bootstrap';
import classnames from 'classnames';

export default React.createClass({
  propTypes: {
    files: React.PropTypes.array
  },
  render() {
    let files = this.props.files || [];

    return (
      files.length === 0
        ? null :
        <div className="fileList">
          {files.map(this._renderFile)}
        </div>
    );
  },
  _renderFile(file) {
    let hasThumbnail = true;
    let viewUrl = file.embedLink || file.alternateLink; // TODO use webcontentLink and img tag
    let classes = classnames({
      file: true,
      placeholder: !hasThumbnail
    });

    let fileElement = hasThumbnail
      ? <img src={file.thumbnailLink || '/files/' + file.id} title={file.title} /> : file.title;

    return (
      <div key={file.id} className={classes}>
        <a href={viewUrl} target="_blank">
          {fileElement}
          <Glyphicon glyph="remove" className="text-danger" onClick={this._onRemoveFile.bind(null, file)} />
        </a>
      </div>
    );
  },
  _onRemoveFile(file, event) {
    event.preventDefault();
    // TODO implement
  }
});