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
  // must use counter, because dragEnter of child might come before dragLeave of parent
  _dragEnterDocumentCount: 0,
  _dragEnterDropZoneCount: 0,
  _nextFileId: 0,
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
          <input ref="file" type="file" multiple className="hidden" onChange={this._onFilesSelected} />
          <Input label="Add files" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
            <div className={dropZoneClasses}
              onDragLeave={this._onDragLeave} onDragEnter={this._onDragEnter} onDrop={this._onDrop}
            >
              <Button onClick={this._onSelectFile}>
                Browse files
              </Button>
              <p>
                {dropZoneMessage}
              </p>
            </div>
            {this._renderFilesList()}
          </Input>
          <Input type="submit" value="Save" wrapperClassName="col-xs-offset-2 col-xs-10" />
        </form>
      </div>
    );
  },
  _renderFilesList: function() {
    return (
      this.state.files.length === 0
        ? null :
        <div>
          {this.state.files.map(this._renderFile)}
        </div>
    );
  },
  _renderFile: function(file) {
    return <div key={file._id} onClick={this._onRemoveFile.bind(this, file)}>{file.name}</div>;
  },
  _onRemoveFile: function(file) {
    var index = this.state.files.indexOf(file);

    if (index !== -1) {
      this.setState({
        files: React.addons.update(this.state.files, {
          $splice: [
            [index, 1]
          ]
        })
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

  _onDragEnterDocument: function() {
    this._dragEnterDocumentCount++;

    if (!this.state.dragActive) {
      this.setState({
        dragActive: true
      });
    }
  },
  _onDragLeaveDocument: function() {
    this._dragEnterDocumentCount--;

    if (this._dragEnterDocumentCount === 0) {
      // user cancelled dragging
      this._endDrag();
    }
  },
  _onDragOver: function(e) {
    e.preventDefault(); // so we can drop file

    // only place where we can update dropEffect
    e.dataTransfer.dropEffect = this.state.dragInZone > 0 ? 'copy' : 'none';
  },
  _onDragEnter: function() {
    this._dragEnterDropZoneCount++;

    if (!this.state.dragInZone) {
      this.setState({
        dragInZone: true
      })
    }
  },
  _onDragLeave: function() {
    this._dragEnterDropZoneCount--;

    if (this._dragEnterDropZoneCount === 0) {
      this.setState({
        dragInZone: false
      });
    }
  },
  _onDrop: function(e) {
    e.preventDefault(); // prevent browser default action

    this._endDrag(this.state.files);
    this._addFiles(e.dataTransfer.files);
  },
  _onSelectFile: function() {
    this.refs.file.getDOMNode().click();
  },
  _onFilesSelected: function(e) {
    this._addFiles(e.target.files);
    e.target.value = null;
  },
  _endDrag: function() {
    this._dragEnterDocumentCount = 0;
    this._dragEnterDropZoneCount = 0;

    this.setState({
      dragActive: false,
      dragInZone: false
    });
  },
  /**
   *
   * @param {FileList} files
   * @private
   */
  _addFiles: function(files) {
    var filesArray = Array.prototype.slice.call(files);

    filesArray.forEach(function(file) {
      file._id = this._nextFileId++;
    }.bind(this));

    this.setState({
      files: React.addons.update(this.state.files, {
        $push : filesArray
      })
    });
  }
});

module.exports = Transactions;