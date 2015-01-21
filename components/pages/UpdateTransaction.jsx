'use strict';

var React = require('react/addons');
var TransactionStore = require('../../stores/TransactionStore');
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Alert = ReactBootstrap.Alert;
var createTransaction = require('../../actions/createTransaction');
var validateTransaction = require('../../validators/transaction');

var Transactions = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    // TEMP test data
    return {
      date: '1990-01-19T20:15',
      description: 'test',
      location: 'koht',
      amount: '-15.45',
      method: 'credit',
      errors: {},
      hasErrors: false,
      dragActive: false,
      dragInZone: false,
      files: [],
      dragFileName: 'choose file'
    };
  },
  componentDidMount: function() {
    document.addEventListener('dragover', this._onDragStart);
    document.addEventListener('dragleave', this._onDragEnd);
  },

  componentWillUnmount: function() {
    document.removeEventListener('dragover', this._onDragStart);
    document.removeEventListener('dragleave', this._onDragEnd);
  },
  render: function() {
    var errorMessage = null;
    var errors = this.state.errors;

    if (this.state.hasErrors) {
      errorMessage = (
        <Alert bsStyle="danger">
          <strong>There were problems creating transaction</strong>
        </Alert>
      );
    }

    var dropZoneStyle = {
      borderWidth: '1px',
      borderColor: '#666',
      borderStyle: this.state.dragInZone ? 'solid' : 'dashed',
      backgroundColor: this.state.dragActive ? 'yellow' : 'cyan'
    };

    return (
      <div>
        <h2>Create transaction</h2>
        {errorMessage}
        <form className="form-horizontal" onSubmit={this._onSubmit} noValidate>
          <Input type="datetime-local" label="Date" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
            valueLink={this.linkState('date')} help={errors.date} bsStyle={errors.date ? 'error' : null} />
          <Input type="textarea" label="Description" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
            valueLink={this.linkState('description')}
            help={errors.description} bsStyle={errors.description ? 'error' : null} />
          <Input type="text" label="Location" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
            valueLink={this.linkState('location')} help={errors.location} bsStyle={errors.location ? 'error' : null} />
          <Input type="number" label="Amount" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
            valueLink={this.linkState('amount')} help={errors.amount} bsStyle={errors.amount ? 'error' : null} />
          <Input type="select" label="Method" defaultValue="debit" labelClassName="col-xs-2"
            wrapperClassName="col-xs-10" valueLink={this.linkState('method')}
            help={errors.method} bsStyle={errors.method ? 'error' : null}
          >
            <option value="debit">Debit card</option>
            <option value="credit">Credit card</option>
            <option value="bank">Bank</option>
            <option value="cash">Cash</option>
          </Input>
          <div className="col-xs-offset-2 col-xs-10" style={dropZoneStyle}
            onDragStart={this._onDragStart} onDragEnd={this._onDragEnd}
            onDragLeave={this._onDragLeave} onDragOver={this._onDragOver} onDrop={this._onDrop}
          >
            {this.state.files.map(function(file) {
              return (<div onClick={this._onRemoveFile.bind(this, file)}>{file.name}</div>);
            }.bind(this))}
            {this.state.dragFileName}
          </div>
          <Input type="submit" value="Save" wrapperClassName="col-xs-offset-2 col-xs-10" />
        </form>
      </div>
    );
  },
  _onRemoveFile: function(file) {
    var index = this.state.files.indexOf(file);

    if (index !== -1) {
      this.state.files.splice(index, 1);

      this.setState({
        files: this.state.files
      });
    }
  },
  _onSubmit: function(e) {
    e.preventDefault();

    var result = validateTransaction(this.state);

    if (result.hasErrors) {
      this.setState({
        hasErrors: true,
        errors: result.errors
      });

      return;
    }

    this.setState({
      hasErrors: false,
      errors: {}
    });

    this.props.context.executeAction(createTransaction, result.data);
  },
  _onDragStart: function(e) {
    e.preventDefault();

    if (!this.state.dragActive) {
      this.setState({
        dragActive: true
      });
    }

    e.dataTransfer.dropEffect = this.state.dragInZone ? 'copy' : 'none';
  },
  _onDragEnd: function() {
    this.setState({
      dragActive: false
    });
  },
  _onDragOver: function(e) {
    e.preventDefault();

    if (!this.state.dragInZone) {
      this.setState({
        dragInZone: true
      });
    }
  },
  _onDragLeave: function() {
    this.setState({
      dragInZone: false,
      dragFileName: 'choose file'
    });
  },
  _onDrop: function(e) {
    console.log('drop', e.target);
    e.preventDefault();
    //e.stopPropagation();

    var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];

    if (file) {
      this.state.files.push(file);
    }

    this.setState({
      dragInZone: false,
      dragActive: false,
      files: this.state.files
    });
  }
});

module.exports = Transactions;