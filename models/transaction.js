'use strict';

var paymentMethods = require('../config/constants').PAYMENT_METHODS;

module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define('Transaction', {
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    method: {
      type: DataTypes.ENUM(paymentMethods),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING
    }
  });

  return Transaction;
};