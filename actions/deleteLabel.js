'use strict';

export default function(context, label) {
  context.dispatch('DELETE_LABEL', label);

  context.service.delete('label', {id: label.id}, {}, (err) => {
    if (err) {
      // some error, restore label
      context.dispatch('UPDATE_LABEL', label);
    }
  });
};
