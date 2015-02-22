var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Label = require('./Label.jsx');

module.exports = React.createClass({
  propTypes: {
    labels: React.PropTypes.array.isRequired
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
          {this.state.labels.map(this._renderLabel)}
          <input type="text" value={this.state.filterText} onFocus={this._showChoices} onBlur={this._hideChoices}
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

    return nameMatches && this.state.labels.indexOf(label) === -1;
  },
  _renderChoice: function(label) {
    return (
      <div className="label-choice" key={label.id} onClick={this._onChoiceSelected.bind(this, label)}>{label.name}</div>
    );
  },
  _onChoiceSelected: function(label) {
    this.setState({
      filterText: '',
      showChoices: false,
      labels: React.addons.update(this.state.labels, {
        $push: [label]
      })
    });
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
    var index = this.state.labels.indexOf(label);

    if (index !== -1) {
      this.setState({
        labels: React.addons.update(this.state.labels, {
          $splice: [[index, 1]]
        })
      });
    }
  }
});