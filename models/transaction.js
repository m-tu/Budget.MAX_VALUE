'use strict';

module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define('Transaction', {
    date: DataTypes.DATE,
    amount: DataTypes.DECIMAL(10,2),
    description: DataTypes.TEXT,
    method: DataTypes.ENUM('cash', 'debit', 'credit', 'bank'),
    location: DataTypes.STRING
  });

  return Transaction;
};