'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var AuthStore = require('../stores/AuthStore');
var FluxibleMixin = require('fluxible').Mixin;
var logout = require('../actions/logout');
var ReactRouterBootstrap = require('react-router-bootstrap');
var NavItemLink = ReactRouterBootstrap.NavItemLink;

var Header = React.createClass({
  mixins: [FluxibleMixin],
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
    var menus = this.state.isLoggedIn ? ['home', 'transactions', 'createTransaction', 'labels'] : ['home', 'login', 'register'];
    var linksHTML = menus.map(function(name) {
      var label = name.slice(0, 1).toUpperCase() + name.slice(1);

      return (
        <NavItemLink key={name} to={name}>{label}</NavItemLink>
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
