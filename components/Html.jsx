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
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" />
          <link rel="stylesheet" href="/public/style.css" />
        </head>
        <body>
          <section id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></section>
          <footer id="info">
            <div className="container">
              <em>Marten ja Timmu saavad miljonärideks!</em>
            </div>
          </footer>
        </body>
        <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
        <script src="/public/js/client.js" defer></script>
      </html>
    );
  }
});


module.exports = Component;
