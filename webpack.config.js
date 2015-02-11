var webpack = require('webpack');

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
    path: __dirname,

    // Filename to use in HTML
    filename: 'client.js',

    // Path to use in HTML
    publicPath: 'http://localhost:3006/public/js/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
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
      }
    ]
  },
  devtool: "#inline-source-map",
  externals: { }
};