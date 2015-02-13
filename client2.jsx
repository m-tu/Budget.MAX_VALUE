var React = require('react');
var Router = require('react-router');
var getRoutes = require('./routes');

Router.run(getRoutes(), Router.HistoryLocation, function(Handler) {
  React.render(<Handler />, document.getElementById('app'));
});