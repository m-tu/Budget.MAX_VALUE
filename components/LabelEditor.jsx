var React = require('react');

module.exports = React.createClass({
  propTypes: {
    labels: React.PropTypes.array.isRequired
  },
  render: function() {
    return (
      <div>
        {this.props.labels.map(this._renderLabel)}
      </div>
    );
  },
  _renderLabel: function(label) {
    return (
      <div key={label.id}>{label.name}</div>
    );
  }
});