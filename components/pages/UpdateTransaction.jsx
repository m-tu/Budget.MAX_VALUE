'use strict';

var React = require('react/addons');
var TransactionStore = require('../../stores/TransactionStore');
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Alert = ReactBootstrap.Alert;
var createTransaction = require('../../actions/createTransaction');
var validateTransaction = require('../../validators/transaction');
var FileSelector = require('../FileSelector.jsx');

var Transactions = React.createClass({
  // must use counter, because dragEnter of child might come before dragLeave of parent
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    // TEMP test data
    return {
      date: '1990-01-19T20:15',
      description: 'kirjeldus',
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
    document.addEventListener('dragenter', this._onDragEnterDocument);
    document.addEventListener('dragleave', this._onDragLeaveDocument);
    document.addEventListener('dragover', this._onDragOver);
  },
  componentWillUnmount: function() {
    document.removeEventListener('dragenter', this._onDragEnterDocument);
    document.removeEventListener('dragleave', this._onDragLeaveDocument);
    document.removeEventListener('dragover', this._onDragOver);
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
          <Input label="Add files" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
            <FileSelector ref="fileSelector" context={this.props.context} />
          </Input>
          <Input type="submit" value="Save" wrapperClassName="col-xs-offset-2 col-xs-10" />
        </form>
      </div>
    );
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

    result.data.files = this.refs.fileSelector.getFiles().map(function(file) {
      return {
        data: file._dataUrl,
        lastModified: file.lastModified,
        name: file.name,
        size: file.size,
        type: file.type
      };
    });

    this.setState({
      hasErrors: false,
      errors: {}
    });

    this.props.context.executeAction(createTransaction, result.data);
  }
});

module.exports = Transactions;