'use strict';

import React from 'react/addons';
import AuthMixin from '../mixins/Auth';

import { FluxibleMixin }from 'fluxible';
import LabelStore from '../stores/LabelStore';

import updateLabelsAction from '../actions/updateLabel';
import deleteLabelAction from '../actions/deleteLabel';
import showLabelsAction from '../actions/showLabels';

import LabelInput from '../components/LabelInput.jsx';
import Label from '../components/Label.jsx';

import { Button, Modal, OverlayMixin } from 'react-bootstrap';

// some hack to use refs in modal
var MyModal = React.createClass({
  mixins: [AuthMixin],
  propTypes: {
    label: React.PropTypes.object.isRequired,
    onSave: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired
  },
  render: function () {
    return (
      <Modal title="Edit modal" onRequestHide={this.props.onClose}>
        <div className="modal-body">
          <LabelInput ref="labelInput" label={this.props.label.name} onChange={this.props.onSave} isModal={true} />
        </div>
        <div className="modal-footer">
          <Button bsStyle="success" onClick={this._onSave}>Save</Button>
        </div>
      </Modal>
    );
  },
  _onSave: function() {
    var labelInput = this.refs.labelInput;

    if (labelInput.isValid()) {
      this.props.onSave(labelInput.getLabelName());
    }
  }
});

export default React.createClass({
  mixins: [
    OverlayMixin,
    FluxibleMixin
  ],
  statics: {
    storeListeners: {
      _onChange: [LabelStore]
    }
  },
  _onChange: function() {
    this.setState(this.getInitialState());
  },
  componentDidMount: function() {
    this.props.context.executeAction(showLabelsAction);
  },
  getInitialState: function() {
    return {
      newLabelName: '',
      labels: this.getStore(LabelStore).getLabels()
    };
  },
  render: function() {
    return (
      <div>
        <h2>Manage labels</h2>
        <LabelInput onChange={this._onAddLabel} withButton={true} inline={true} />
        {this.state.labels.map(this._renderLabel)}
      </div>
    );
  },
  renderOverlay: function () {
    if (!this.state.editing) {
      return null;
    }

    return (
      <MyModal label={this.state.editing} onSave={this._saveLabel} onClose={this._closeModal} />
    );
  },
  _renderLabel: function(label) {
    return (
      <Label key={label.id} label={label} onDelete={this._deleteLabel} onEdit={this._editLabel} />
    );
  },
  _deleteLabel: function(label) {
    this.props.context.executeAction(deleteLabelAction, label);
  },
  _closeModal: function() {
    this.setState({
      editing: null
    });
  },
  _editLabel: function(label) {
    this.setState({
      editing: {
        name: label.name,
        id: label.id
      }
    });
  },
  _saveLabel: function(name) {
    var label = this.state.editing;

    label.name = name;
    this.props.context.executeAction(updateLabelsAction, label);

    this._closeModal();
  },
  _onAddLabel: function(name) {
    this.props.context.executeAction(updateLabelsAction, {
      name: name
    });

    this.setState({
      newLabelName: ''
    });
  }
});