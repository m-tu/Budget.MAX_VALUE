/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';
var webpack = require('webpack');

module.exports = {
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    entry: './client.js',
    output: {
        path: __dirname+'/build/js',
        filename: 'client.js'
    },
    module: {
        loaders: [
            { test: /\.jsx$/, loader: 'jsx-loader' }
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin()
    ]
};
