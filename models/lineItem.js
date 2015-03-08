'use strict';

export default function(sequelize, DataTypes) {
  var LineItem = sequelize.define('LineItem', {
    name: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10, 2)
  }, {
    classMethods: {
      associate: function(models) {
        LineItem.belongsToMany(models.Label, {
          through: models.LineItemLabels,
          as: 'labels'
        });
      }
    }
  });

  return LineItem;
};