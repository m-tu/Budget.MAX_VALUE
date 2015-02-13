var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler  = Router.RouteHandler;

var Root = module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Tere</h1>
        <Link to="home">Home</Link>
        <Link to="home2">Home2</Link>

        <RouteHandler {...this.props} />
      </div>
    );
  }
});