var React = require('react');
var Router = require('react-router');
var Header = require('../components/Header.jsx');
var Link = Router.Link;
var RouteHandler  = Router.RouteHandler;

var Root = module.exports = React.createClass({
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