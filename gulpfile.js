'use strict';

var path = require('path');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var webpack = require('gulp-webpack');
var web = require('webpack');


gulp.task('webpack', [], function() {
  return gulp.src('./client.js')
    .pipe(webpack({
      watch: true,
      resolve: {
        extensions: ['', '.js', '.jsx']
      },
      entry: [
        'webpack/hot/only-dev-server'
      ],
      module: {
        loaders: [
          { test: /\.jsx$/, loaders: ['react-hot', 'jsx-loader'] }
        ]
      },
      plugins: [
        new web.HotModuleReplacementPlugin()
      ],
      output: {
        filename: 'client.js'
      }
    }))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('webpack2', function() {
  web({
    watch: true,
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    entry: [
      'webpack-dev-server/client?http://localhost:3005',
      'webpack/hot/dev-server',
      './client.js'
    ],
    module: {
      loaders: [
        { test: /\.jsx$/, loaders: ['react-hot', 'jsx-loader'] }
      ]
    },
    plugins: [
      new web.HotModuleReplacementPlugin()
    ],
    output: {
      // Where to put build results when doing production builds:
      // (Server doesn't write to the disk, but this is required.)
      path: __dirname + '/build/js/',

      // Filename to use in HTML
      filename: 'client.js',

      // Path to use in HTML
      publicPath: 'http://localhost:3005/js/'
    }
  }, function (err, stats) {
    console.log(err, 'stats')
  });
})

gulp.task('watch', function() {
  gulp.watch('./**/*.*', ['webpack']);
})

gulp.task('nodemon', function () {
  nodemon({ script: 'server.js', ext: 'js jsx', ignore: ['build/'] })
    .on('change', ['webpack'])
    .on('restart', function () {
      console.log('restarted!')
    })
})

//gulp.task('watch', function() {
//  gulp.watch(path.join(src, '**/*.*')).on('change', function(event) {
//    if (event.type === 'changed') {
//      gulp.src(event.path, { base: path.resolve(src) })
//        .pipe(webpack.closest())
//        .pipe(webpack.watch(webpackOptions, function(stream, err, stats) {
//          stream
//            .pipe(webpack.proxy(err, stats))
//            .pipe(webpack.format({
//              verbose: true,
//              version: false
//            }))
//            .pipe(gulp.dest(dest));
//        }));
//    }
//  });
//});