'use strict';

import React from 'react';
import { Input } from 'react-bootstrap';
import Label from './Label.jsx';

export default React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  propTypes: {
    labels: React.PropTypes.array.isRequired,
    value: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired
  },
  getDefaultProps() {
    return {
      value: []
    }
  },
  getInitialState() {
    return {
      labels: [],
      showChoices: false,
      filterText: ''
    };
  },
  render() {
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
  _renderChoices() {
    if (!this.state.showChoices) {
      return null;
    }

    return (
      <div>
        {this.props.labels.filter(this._filterChoice).map(this._renderChoice)}
      </div>
    );
  },
  _filterTextChanged(e) {
    this.setState({
      filterText: e.target.value
    });
  },
  _filterChoice(label) {
    var nameMatches = this.state.filterText === '' ||
      label.name.toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1;

    return nameMatches && this.props.value.indexOf(label) === -1;
  },
  _renderChoice(label) {
    return (
      <div className="label-choice" key={label.id} onClick={this._onChoiceSelected.bind(null, label)}>{label.name}</div>
    );
  },
  _onChoiceSelected(label) {
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
  _showChoices() {
    this.setState({
      showChoices: true
    });
  },
  _hideChoices() {
    window.setTimeout(() => {
      this.setState({
        showChoices: false
      });
    }, 100);
  },
  _renderLabel(label) {
    return (
      <Label key={label.id} label={label} onDelete={this._onRemove} />
    );
  },
  _onRemove(label) {
    let index = this.props.value.indexOf(label);

    if (index !== -1) {
      this.props.onChange(
        React.addons.update(this.props.value, {
          $splice: [[index, 1]]
        })
      );
    }
  }
});