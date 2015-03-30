// Native node.js, cant use ES6 (yet)

require('babel/register')({
  experimental: true
});
var app = require('./server-bootstrapper');
module.exports = app;