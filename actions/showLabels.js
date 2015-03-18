'use strict';

export default function (context, payload, done) {
  context.dispatch('RECEIVE_LABELS_START', payload);

  context.service.read('label', {}, {}, (err, labels) => {
    if (err) {
      context.dispatch('RECEIVE_LABELS_FAIL', payload);
      done();
      return;
    }
    context.dispatch('RECEIVE_LABELS_DONE', labels);
    done();
  });
};
