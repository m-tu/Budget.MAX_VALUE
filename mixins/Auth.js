var AuthStore = require('../stores/AuthStore');
var app = require('../app');

module.exports = {
   statics: {
     willTransitionTo: function(transition) {
       if (!app.context.getComponentContext().getStore(AuthStore).isLoggedIn()) {
         transition.redirect('/login');
       }
     }
   }
 };