var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var NavLink = require('flux-router-component').NavLink;
var AuthStore = require('../stores/AuthStore');
var StoreMixin = require('fluxible-app').StoreMixin;
var logout = require('../actions/logout');

var Header = React.createClass({
  mixins: [StoreMixin],
  statics: {
    storeListeners: {
      _onChange: [AuthStore]
    }
  },
  getInitialState: function() {
    return {
      isLoggedIn: this.getStore(AuthStore).isLoggedIn()
    };
  },
  _onChange: function() {
    this.setState(this.getInitialState());
  },
  render: function() {
    var menus = this.state.isLoggedIn ? ['home', 'users'] : ['home', 'login', 'register'];
    var selected = this.props.selected;
    var links = this.props.links;
    var context = this.props.context;
    var linksHTML = menus.map(function(name) {
      var link = links[name],
          className = selected === name ? 'active' : '';

        return (
          <li key={link.path} className={className}>
            <NavLink routeName={link.page} context={context}>{link.label}</NavLink>
          </li>
        );
      });

    if (this.state.isLoggedIn) {
      linksHTML.push(
        <li key="/logout">
          <a href="/logout" onClick={this._logOut}>Log out</a>
        </li>
      );
    }

    return (
      <Navbar>
        <Nav>
          {linksHTML}
        </Nav>
      </Navbar>
    );
  },
  _logOut: function(event) {
    event.preventDefault();

    this.props.context.executeAction(logout);
  }
});

module.exports = Header;
