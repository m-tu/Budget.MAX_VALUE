/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';
var webpack = require('webpack');

module.exports = {
  watch: true,
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  entry: [
    'webpack-dev-server/client?http://localhost:3006',
    'webpack/hot/dev-server',
    './client.js'
  ],
  module: {
    loaders: [
      { test: /\.jsx$/, loaders: ['react-hot', 'jsx-loader'] }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    // Where to put build results when doing production builds:
    // (Server doesn't write to the disk, but this is required.)
    path: __dirname + '/build/js/',

    // Filename to use in HTML
    filename: 'client.js',
    publicPath: 'http://localhost:3005/build/js'
  }
};
