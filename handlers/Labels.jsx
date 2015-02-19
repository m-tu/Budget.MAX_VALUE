'use strict';

var React = require('react/addons');

var StoreMixin = require('fluxible').StoreMixin;

var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Label = ReactBootstrap.Label;
var Glyphicon = ReactBootstrap.Glyphicon;
var Modal = ReactBootstrap.Modal;

var Transactions = React.createClass({
  mixins: [
    ReactBootstrap.OverlayMixin,
    StoreMixin
  ],
  statics: {
    storeListeners: {
    }
  },
  getInitialState: function() {
    return {
      labels: [{
        id: 1,
        name: 'tere'
      }, {
        id: 2,
        name: 'sup'
      }]
    };
  },

  _onChange: function() {
    this.setState({
      labels: [],
      editing: null
    });
  },
  render: function() {
    return (
      <div>
        <h2>Manage labels</h2>
        <form className="form-inline" onSubmit={this._onAddLabel}>
          <Input type="text" className="form-control" buttonAfter={<Button bsStyle="success">Add</Button>} />
        </form>
        {this.state.labels.map(this._renderLabel)}
      </div>
    );
  },
  renderOverlay: function () {
    if (!this.state.editing) {
      return <span/>;
    }

    return (
      <Modal title="Edit modal" onRequestHide={this._closeModal}>
        <div className="modal-body">
          <form className="inline-form" onSubmit={this._saveLabel}>
            <Input type="text" value={this.state.editing.name} onChange={this._labelNameChanged} />
          </form>
        </div>
        <div className="modal-footer">
          <Button bsStyle="success" onClick={this._saveLabel}>Save</Button>
        </div>
      </Modal>
    );
  },
  _saveLabel: function(e) {
    e.preventDefault();

    this._closeModal();
  },
  _labelNameChanged: function(e) {
    this.setState({
      editing: {
        name: e.target.value,
        id: this.state.editing.id
      }
    });
  },
  _renderLabel: function(label) {
    return (
      <Label key={label.id}>
        <span className="text">{label.name}</span>
        <Glyphicon glyph="edit" onClick={this._editLabel.bind(this, label)} /> | <Glyphicon glyph="remove" />
      </Label>
    );
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
  _onAddLabel: function(e) {
    e.preventDefault();

    //this.setState({
    //  labels:
    //})

    this.props.context.executeAction(createTransaction, result.data);
  }
});

module.exports = Transactions;