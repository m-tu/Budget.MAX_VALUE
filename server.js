// Native node.js, cant use ES6 (yet)

require('babel/register')({
  experimental: true
});
require('./server-bootstrapper');