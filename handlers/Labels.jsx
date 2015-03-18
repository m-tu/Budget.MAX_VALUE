'use strict';

import React from 'react/addons';
import AuthMixin from '../mixins/Auth';

import { FluxibleMixin }from 'fluxible';
import { LabelStore } from '../stores';
import { updateLabelAction, deleteLabelAction, showLabelsAction } from '../actions';
import { Button, Modal, OverlayMixin } from 'react-bootstrap';

import LabelInput from '../components/LabelInput.jsx';
import Label from '../components/Label.jsx';

// some hack to use refs in modal
var MyModal = React.createClass({
  mixins: [AuthMixin],
  propTypes: {
    label: React.PropTypes.object.isRequired,
    onSave: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired
  },
  render() {
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
  _onSave() {
    let labelInput = this.refs.labelInput;

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
  _onChange() {
    this.setState(this.getInitialState());
  },
  componentDidMount() {
    this.props.context.executeAction(showLabelsAction);
  },
  getInitialState() {
    return {
      newLabelName: '',
      labels: this.getStore(LabelStore).getLabels()
    };
  },
  render() {
    return (
      <div>
        <h2>Manage labels</h2>
        <LabelInput onChange={this._onAddLabel} withButton={true} inline={true} />
        {this.state.labels.map(this._renderLabel)}
      </div>
    );
  },
  renderOverlay() {
    if (!this.state.editing) {
      return null;
    }

    return (
      <MyModal label={this.state.editing} onSave={this._saveLabel} onClose={this._closeModal} />
    );
  },
  _renderLabel(label) {
    return (
      <Label key={label.id} label={label} onDelete={this._deleteLabel} onEdit={this._editLabel} />
    );
  },
  _deleteLabel(label) {
    this.props.context.executeAction(deleteLabelAction, label);
  },
  _closeModal() {
    this.setState({
      editing: null
    });
  },
  _editLabel(label) {
    this.setState({
      editing: {
        name: label.name,
        id: label.id
      }
    });
  },
  _saveLabel(name) {
    let label = this.state.editing;

    label.name = name;
    this.props.context.executeAction(updateLabelAction, label);

    this._closeModal();
  },
  _onAddLabel(name) {
    this.props.context.executeAction(updateLabelAction, {
      name: name
    });

    this.setState({
      newLabelName: ''
    });
  }
});