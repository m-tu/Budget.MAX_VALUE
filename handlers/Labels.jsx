'use strict';

var React = require('react/addons');

var FluxibleMixin = require('fluxible').Mixin;
var LabelStore = require('../stores/LabelStore');

var updateLabelsAction = require('../actions/updateLabel');
var deleteLabelAction = require('../actions/deleteLabel');
var showLabelsAction = require('../actions/showLabels');

var LabelInput = require('../components/LabelInput.jsx');
var Label = require('../components/Label.jsx');

var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;

// some hack to use refs in modal
var MyModal = React.createClass({
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

var Transactions = React.createClass({
  mixins: [
    ReactBootstrap.OverlayMixin,
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
      <Label label={label} onDelete={this._deleteLabel} onEdit={this._editLabel} />
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

module.exports = Transactions;