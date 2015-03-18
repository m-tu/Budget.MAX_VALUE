'use strict';

export default function(sequelize, DataTypes) {
  let Label = sequelize.define('Label', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate(models) {
        Label.belongsToMany(models.LineItem, {
          through: models.LineItemLabels
        });
      }
    }
  });

  return Label;
};