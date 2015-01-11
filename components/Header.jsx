var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var NavLink = require('flux-router-component').NavLink;

var Header = React.createClass({
  render: function() {
    var selected = this.props.selected || this.state.selected,
      links = this.props.links || this.state.links,
      context = this.props.context,
      linksHTML = Object.keys(links).map(function(name) {
        var link = links[name],
            className = selected === name ? 'active' : '';

        return (
          <li key={link.path} className={className}>
            <NavLink routeName={link.page} context={context}>{link.label}</NavLink>
          </li>
        );
      });

    return (
      <Navbar>
        <Nav>
          {linksHTML}
        </Nav>
      </Navbar>
    );
  }
});

module.exports = Header;
