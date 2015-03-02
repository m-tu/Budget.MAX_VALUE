'use strict';

module.exports = function(context, transaction) {
  context.dispatch('CLEAR_UNSAVED_TRANSACTION', transaction);
};
