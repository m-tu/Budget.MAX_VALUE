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
  }, {
    classMethods: {
      associate: function(models) {
        Transaction.hasMany(models.File, {
          as: 'files',
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });

        Transaction.hasMany(models.LineItem, {
          as: 'lineItems',
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
      }
    }
  });

  return Transaction;
};