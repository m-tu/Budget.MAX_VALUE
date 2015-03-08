'use strict';

import React from 'react';
import { Link, RouteHandler } from 'react-router';
import Header from '../components/Header.jsx';

export default React.createClass({
  render: function() {
    return (
      <div>
        <Header context={this.props.context} />
        <div className="container">
          <RouteHandler {...this.props} />
        </div>
      </div>
    );
  }
});