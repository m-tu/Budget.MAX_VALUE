'use strict';

import { PAYMENT_METHODS } from '../config/constants';

export default function(sequelize, DataTypes) {
  let Transaction = sequelize.define('Transaction', {
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
      type: DataTypes.ENUM(PAYMENT_METHODS),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate(models) {
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