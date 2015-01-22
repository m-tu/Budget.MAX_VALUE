'use strict';

var React = require('react/addons');
var TransactionStore = require('../../stores/TransactionStore');
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Alert = ReactBootstrap.Alert;
var createTransaction = require('../../actions/createTransaction');
var validateTransaction = require('../../validators/transaction');
var cx = React.addons.classSet;

var Transactions = React.createClass({
  dragCount: 0,
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
    document.addEventListener('dragenter', this._onDragStart);
    document.addEventListener('dragleave', this._onDragLeaveDocument);
    document.addEventListener('dragend', this._onDragEnd);
  },

  componentWillUnmount: function() {
    document.removeEventListener('dragenter', this._onDragStart);
    document.removeEventListener('dragleave', this._onDragEnd);
    document.removeEventListener('dragend', this._onDragLeaveDocument);
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


    var dropZoneClasses = cx({
      dropzone: true,
      visible: this.state.dragActive,
      active: this.state.dragInZone
    });
    var dropZoneMessage = this.state.dragActive ? 'Drop here' : 'or drag here';

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
          <input ref="file" type="file" multiple className="hidden" />
          <Input label="Add files" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
              <div className={dropZoneClasses}
                onDragLeave={this._onDragLeave} onDragOver={this._onDragOver} onDrop={this._onDrop}
              >
                <Button onClick={this._onSelectFile}>
                  Browse files
                </Button>
                <p>
                  {dropZoneMessage}
                </p>
              </div>
          </Input>
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
    e.dataTransfer.dropEffect = 'none';
    this.dragCount++;

    if (!this.state.dragActive) {
      this.setState({
        dragActive: true
      });

      this._updateDragIcon(e);
    }
  },
  _onDragLeaveDocument: function(e) {
    this.dragCount--;

    if (this.dragCount > 0) {
      return
    }
    //console.log(e.target)
    this.setState({
      dragActive: false
    });
  },
  _onDragEnd: function() {
    this.setState({
      dragActive: false
    })
  },
  _onDragOver: function(e) {
    e.stopPropagation();

    if (!this.state.dragInZone) {
      this.setState({
        dragInZone: true
      });
    }
  },
  _onDragLeave: function(e) {
    e.stopPropagation();

    this.setState({
      dragInZone: false,
      dragFileName: 'choose file'
    });
    this._updateDragIcon(e);
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
    this._updateDragIcon(e);
  },
  _onSelectFile: function() {
    this.refs.file.getDOMNode().click();
  },
  _updateDragIcon: function(e) {
    console.log(e, e.dataTransfer);
    if (!e || !e.dataTransfer) {
      return;
    }

    console.log('niiger', this.state.dragInZone)
    //e.dataTransfer.dropEffect = this.state.dragInZone ? 'copy' : 'none';
  }
});

module.exports = Transactions;