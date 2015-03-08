'use strict';

export default function(context, transaction) {
  context.dispatch('CLEAR_UNSAVED_TRANSACTION', transaction);
};
