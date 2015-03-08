'use strict';

import { PAYMENT_METHODS } from '../config/constants';

/**
 *
 * @param {{}} rawTransaction
 * @returns {{data: {}, errors: {}, hasErrors: boolean}}
 */
export default function(rawTransaction) {
  var errors = {};
  var transaction = {};

  // date-time
  var date = new Date(rawTransaction.date);
  if (isNaN(date.getTime())) {
    errors.date = 'Invalid date';
  } else {
    transaction.date = date;
  }

  // amount
  var amount = parseFloat(rawTransaction.amount);
  if (isNaN(amount)) {
    errors.amount = 'Invalid amount';
  } else {
    transaction.amount = amount;
  }

  // method
  if (PAYMENT_METHODS.indexOf(rawTransaction.method) === -1) {
    errors.method = 'Invalid method';
  } else {
    transaction.method = rawTransaction.method;
  }

  // description
  if (!rawTransaction.description) {
    errors.description = 'Description is required';
  } else {
    transaction.description = rawTransaction.description;
  }

  // location
  transaction.location = rawTransaction.location;

  return {
    data: transaction,
    errors: errors,
    hasErrors: Object.keys(errors).length > 0
  };
};