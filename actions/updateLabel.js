'use strict';

import LabelStore from '../stores/LabelStore';

export default function(context, label) {
  context.service.update('label', {id: label.id}, label, (err, newLabel) => {
    if (err) {
      return;
    }

    context.dispatch('UPDATE_LABEL', newLabel);
  });
};
