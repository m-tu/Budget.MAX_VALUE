'use strict';

var LabelStore = require('../stores/LabelStore');

module.exports = function(context, label) {
  context.service.update('label', {id: label.id}, label, function(err, newLabel) {
    if (err) {
      return;
    }

    context.dispatch('UPDATE_LABEL', newLabel);
  });
};
