'use strict';

export default function(sequelize, DataTypes) {
  let LineItem = sequelize.define('LineItem', {
    name: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10, 2)
  }, {
    classMethods: {
      associate(models) {
        LineItem.belongsToMany(models.Label, {
          through: models.LineItemLabels,
          as: 'labels'
        });
      }
    }
  });

  return LineItem;
};