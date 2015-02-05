'use strict';

var React = require('react/addons');
var TransactionStore = require('../../stores/TransactionStore');
var CreateTransactionStore = require('../../stores/CreateTransactionStore');
var ApplicationStore = require('../../stores/ApplicationStore');
var TransactionStore = require('../../stores/TransactionStore');
var StoreMixin = require('fluxible').StoreMixin;
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var createTransaction = require('../../actions/createTransaction');
var validateTransaction = require('../../validators/transaction');
var FileSelector = require('../FileSelector.jsx');
var FileGallery = require('../FileGallery.jsx');
var openGooglePicker = require('../../actions/openGooglePicker');

var Transactions = React.createClass({
  _mounted: false,
  mixins: [
    React.addons.LinkedStateMixin,
    StoreMixin
  ],
  statics: {
    storeListeners: {
      _onChange: [CreateTransactionStore],
      _onRouteChange: [ApplicationStore]
    }
  },
  // must use counter, because dragEnter of child might come before dragLeave of parent
  getInitialState: function() {
    var transactionId = this._getTransactionId();
    var transaction = this.getStore(TransactionStore).getTransaction(transactionId) || {};

    // TEMP test data
    return {
      date: transaction.date ? transaction.date.toISOString().slice(0, -1) : '',
      description: transaction.description || '',
      location: transaction.location || '',
      amount: transaction.amount || '',
      method: transaction.method || '',
      errors: {},
      hasErrors: false,
      dragActive: false,
      dragInZone: false,
      files: this.getStore(CreateTransactionStore).getFiles(),
      dragFileName: 'choose file',
      transactionId: transactionId
    };
  },
  _getTransactionId: function() {
    return parseInt(this.getStore(ApplicationStore).getState().route.params.id, 10) || null;
  },
  _onChange: function() {
    this.setState({
      files: this.getStore(CreateTransactionStore).getFiles()
    });
  },
  _onRouteChange: function() {
    if (!this._mounted) {
      return;
    }

    var transactionId = this._getTransactionId();
    var transaction = this.getStore(TransactionStore).getTransaction(transactionId) || {};

    this.setState({
      date: transaction.date ? transaction.date.toISOString().slice(0, -1) : '',
      description: transaction.description || '',
      location: transaction.location || '',
      amount: transaction.amount || '',
      method: transaction.method || '',
      transactionId: transactionId
    });
  },
  componentDidMount: function() {
    this._mounted = true;
    document.addEventListener('dragenter', this._onDragEnterDocument);
    document.addEventListener('dragleave', this._onDragLeaveDocument);
    document.addEventListener('dragover', this._onDragOver);
  },
  componentWillUnmount: function() {
    this._mounted = false;
    document.removeEventListener('dragenter', this._onDragEnterDocument);
    document.removeEventListener('dragleave', this._onDragLeaveDocument);
    document.removeEventListener('dragover', this._onDragOver);
    // TODO clear CreateTransactionStore
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
          <Input label="Files" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
            <Button onClick={this._onAddFilesFromGoogle}>Add from Google drive</Button>
            <FileGallery files={this.state.files} />
          </Input>
          <Input bsStyle="primary" type="submit" value={this.state.transactionId ? 'Update' : 'Create'} wrapperClassName="col-xs-offset-2 col-xs-10" />
        </form>
      </div>
    );
  },
  _onAddFilesFromGoogle: function() {
    this.props.context.executeAction(openGooglePicker);
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

    result.data.files = this.state.files.map(function(file) {
      return {
        id: file.id,
        title: file.title,
        embedLink: file.embedLink,
        imageUrl: file.imageUrl,
        thumbnailLink: file.thumbnailLink
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