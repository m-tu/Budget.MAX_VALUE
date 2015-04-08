// Native node.js, cant use ES6 (yet)

require('babel/register')({
  stage: 0
});
var app = require('./server-bootstrapper');
module.exports = app;