'use strict';

import React from 'react';
import { Label, Glyphicon } from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    label: React.PropTypes.object.isRequired,
    onDelete: React.PropTypes.func,
    onEdit: React.PropTypes.func
  },
  render() {
    return (
      <Label>
        <span className="text">{this.props.label.name}</span>
        {this.props.onEdit ? <Glyphicon glyph="edit" onClick={this.props.onEdit.bind(null, this.props.label)} /> : null}
        {this.props.onDelete ? <Glyphicon glyph="remove" onClick={this.props.onDelete.bind(null, this.props.label)} /> : null }
      </Label>
    );
  }
});