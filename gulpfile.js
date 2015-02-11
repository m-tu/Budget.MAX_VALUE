'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config');
var gutil = require('gulp-util');


gulp.task('dev', function() {
  var server = new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'http://localhost:3005',
    noInfo: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  });

  server.listen(3006, 'localhost', function() {
    gutil.log('Webpack server listening on port 3006');

    nodemon();
  });
});