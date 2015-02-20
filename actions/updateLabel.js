'use strict';

var LabelStore = require('../stores/LabelStore');

module.exports = function(context, label) {
  var oldLabel = label.id ? context.getStore(LabelStore).getLabelById(label.id) : null;


  label.id = label.id || Date.now();

  context.dispatch('UPDATE_LABEL', label);

  //context.service.update('label', {id: label.id}, label, function(err, newLabel) {
  //  if (err) {
  //    return context.dispatch('UPDATE_LABEL', oldLabel);
  //  }
  //
  //  context.dispatch('UPDATE_LABEL', newLabel);
  //});
};
