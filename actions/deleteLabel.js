'use strict';

module.exports = function(context, label) {
  context.dispatch('DELETE_LABEL', label);

  //context.service.update('label', {id: label.id}, label, function(err, newLabel) {
  //  if (err) {
  //    return context.dispatch('UPDATE_LABEL', oldLabel);
  //  }
  //
  //  context.dispatch('UPDATE_LABEL', newLabel);
  //});
};
