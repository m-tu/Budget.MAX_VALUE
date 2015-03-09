'use strict';

import { AuthStore } from '../stores';
import app from '../app';

export default {
   statics: {
     willTransitionTo: function(transition) {
       if (!app.context.getComponentContext().getStore(AuthStore).isLoggedIn()) {
         transition.redirect('/login');
       }
     }
   }
 };