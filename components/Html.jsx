/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';
var React = require('react');


var Component = React.createClass({
    render: function() {
        return (
            <html>
            <head>
                <meta charSet="utf-8" />
                <title>Budget.MAX_VALUE</title>
                <meta name="viewport" content="width=device-width, user-scalable=no" />
            </head>
            <body>
                <section id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></section>
                <footer id="info">
                    <p>Marten ja Timmu saavad miljonärideks!</p>
                </footer>
            </body>
            <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
            <script src="/public/js/client.js" defer></script>
            </html>
        );
    }
});


module.exports = Component;
