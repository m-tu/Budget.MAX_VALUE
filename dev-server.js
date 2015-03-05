'use strict';

var cluster = require('cluster');

if (!cluster.isMaster) {
  return require('./server');
}

console.log('started master with ' + process.pid);

var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config');
var webpack = require('webpack');
var watch = require('watch');

// start child process that is a actual server
cluster.fork();

// start webpack
var server = new WebpackDevServer(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  contentBase: 'http://localhost:3005',
  hot: true,
  noInfo: true,
  quiet: true,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});

server.listen(3006, 'localhost', function() {
  console.log('Webpack server listening on port 3006');
});

// start file watcher for server reload
watch.watchTree('.', function (file) {
  if (typeof file === 'string' && (file.slice(-3) === '.js' || file.slice(-4) === '.jsx')) {
    reloadWorker();
  }
});

function reloadWorker() {
  console.log('starting new worker');

  var newWorker = cluster.fork();

  newWorker.once('listening', function () {
    console.log('new worker ready');
    //stop all other workers
    for (var id in cluster.workers) {
      if (id === newWorker.id.toString()) {
        continue;
      }

      cluster.workers[id].process.kill('SIGTERM');
    }
  });
}
