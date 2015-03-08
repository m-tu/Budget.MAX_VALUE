'use strict';

export default function(sequelize, DataTypes) {
  var Label = sequelize.define('Label', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Label.belongsToMany(models.LineItem, {
          through: models.LineItemLabels
        });
      }
    }
  });

  return Label;
};