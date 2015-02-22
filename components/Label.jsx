var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Label = ReactBootstrap.Label;
var Glyphicon = ReactBootstrap.Glyphicon;

module.exports = React.createClass({
  propTypes: {
    label: React.PropTypes.object.isRequired,
    onDelete: React.PropTypes.func,
    onEdit: React.PropTypes.func
  },
  render: function() {
    return (
      <Label>
        <span className="text">{this.props.label.name}</span>
        {this.props.onEdit ? <Glyphicon glyph="edit" onClick={this.props.onEdit.bind(this, this.props.label)} /> : null}
        {this.props.onDelete ? <Glyphicon glyph="remove" onClick={this.props.onDelete.bind(this, this.props.label)} /> : null }
      </Label>
    );
  }
});