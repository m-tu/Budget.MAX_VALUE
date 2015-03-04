var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;

var LabelInput = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.string,
    withButton: React.PropTypes.bool,
    inline: React.PropTypes.bool,
    isModal: React.PropTypes.bool
  },
  getDefaultProps: function() {
    return {
      label: ''
    }
  },
  getInitialState: function() {
    return {
      name: this.props.label,
      error: null
    }
  },
  render: function() {
    return (
      <form className={this.props.inline ? 'form-inline' : ''} onSubmit={this.validate}>
        <Input
          type="text" placeholder="Label name" autoFocus
          value={this.state.name} onChange={this._onChange}
          help={this.state.error} bsStyle={this.state.error ? 'error' : null}
          buttonAfter={this.props.withButton ? <Button type="submit" bsStyle="success">Add</Button> : null}
        />
      </form>
    );
  },
  isValid: function() {
    return this.getLabelName() !== '';
  },
  getLabelName: function() {
    return this.state.name.trim();
  },
  _onChange: function(e) {
    this.setState({
      name: e.target.value,
      error: null
    });
  },
  validate: function(e) {
    e && e.preventDefault();

    if (this.isValid()) {
      var name = this.getLabelName();
      this.props.onChange(name);

      if (!this.props.isModal) {
        // for some reason, react tries to update component after the modal is destroyed
        this.setState({
          name: ''
        });
      }
    } else {
      this.setState({
        error: 'Enter non-empty name for label'
      })
    }
  }
});

module.exports = LabelInput;