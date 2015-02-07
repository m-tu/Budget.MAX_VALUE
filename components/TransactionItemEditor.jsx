'use strict';

var React = require('react/addons');
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;

var TransactionItemEditor = React.createClass({
  getInitialState: function() {
    return {
      items: []
    }
  },
  render: function() {
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this._renderForm()}
            {this.state.items.map(this._renderItem)}
          </tbody>
        </Table>
      </div>
    );
  },
  _renderForm: function() {
    return (
      <tr>
        <td><Input type="text" placeholder="Name" /></td>
        <td><Input type="number" placeholder="Amount" /></td>
        <td><Input type="button"  value="Add" onSubmit={this._onSubmit} /></td>
      </tr>
    );

  },
  _renderItem: function() {
    return null
  }
});

module.exports = TransactionItemEditor;