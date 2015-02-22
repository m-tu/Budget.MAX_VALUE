var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Label = require('./Label.jsx');

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  propTypes: {
    labels: React.PropTypes.array.isRequired,
    value: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired
  },
  getDefaultProps: function() {
    return {
      value: []
    }
  },
  getInitialState: function() {
    return {
      labels: [],
      showChoice: false,
      filterText: ''
    };
  },
  render: function() {
    return (
      <div>
        <div>
          {this.props.value.map(this._renderLabel)}
          <Input type="text" placeholder="Add labels"
                 value={this.state.filterText} onFocus={this._showChoices} onBlur={this._hideChoices}
                 onChange={this._filterTextChanged} />
        </div>
        {this._renderChoices()}
      </div>
    );
  },
  _renderChoices: function() {
    if (!this.state.showChoices) {
      return null;
    }

    return (
      <div>
        {this.props.labels.filter(this._filterChoice).map(this._renderChoice)}
      </div>
    );
  },
  _filterTextChanged: function(e) {
    this.setState({
      filterText: e.target.value
    });
  },
  _filterChoice: function(label) {
    var nameMatches = this.state.filterText === '' ||
      label.name.toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1;

    return nameMatches && this.props.value.indexOf(label) === -1;
  },
  _renderChoice: function(label) {
    return (
      <div className="label-choice" key={label.id} onClick={this._onChoiceSelected.bind(this, label)}>{label.name}</div>
    );
  },
  _onChoiceSelected: function(label) {
    this.setState({
      filterText: '',
      showChoices: false
    });

    this.props.onChange(
      React.addons.update(this.props.value, {
        $push: [label]
      })
    );
  },
  _showChoices: function() {
    this.setState({
      showChoices: true
    });
  },
  _hideChoices: function() {
    window.setTimeout(function() {
      this.setState({
        showChoices: false
      });
    }.bind(this),100)

  },
  _renderLabel: function(label) {
    return (
      <Label label={label} onDelete={this._onRemove} />
    );
  },
  _onRemove: function(label) {
    var index = this.props.value.indexOf(label);

    if (index !== -1) {
      this.props.onChange(
        React.addons.update(this.props.value, {
          $splice: [[index, 1]]
        })
      );
    }
  }
});