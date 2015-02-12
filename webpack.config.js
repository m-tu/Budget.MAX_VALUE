var webpack = require('webpack');
var path = require('path');

module.exports = {
  // Entry point for static analyzer:
  entry: [
    'webpack-dev-server/client?http://localhost:3006',
    'webpack/hot/dev-server',
    './client.js'
  ],

  output: {
    // Where to put build results when doing production builds:
    // (Server doesn't write to the disk, but this is required.)
    path: path.join(__dirname, 'build'),

    // Filename to use in HTML
    filename: '[name].js',

    // Path to use in HTML
    publicPath: 'http://localhost:3006/public/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
    //, new ExtractTextPlugin('[name].css') // for production build
  ],

  resolve: {
    // Allow to omit extensions when requiring these files
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      // Pass *.jsx files through jsx-loader transform
      {
        test: /\.jsx$/,
        loaders: ['react-hot', 'jsx']
      }, {
        test: /\.less$/,
        //loader: ExtractTextPlugin.extract('style-loader', 'css-loader') // for production build
        loader: 'style-loader!css-loader'
      }

    ]
  },
  devtool: '#inline-source-map'
};