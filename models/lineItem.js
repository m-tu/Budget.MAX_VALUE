'use strict';

module.exports = function(sequelize, DataTypes) {
  var LineItem = sequelize.define('LineItem', {
    name: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10, 2)
  }, {
    classMethods: {
      associate: function(models) {
        LineItem.hasMany(models.Label, {
          as: 'labels'
        });
      }
    }
  });

  return LineItem;
};