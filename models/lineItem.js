'use strict';

module.exports = function(sequelize, DataTypes) {
  var LineItem = sequelize.define('LineItem', {
    name: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10, 2)
  }, {
    classMethods: {
      associate: function(models) {
        LineItem.belongsToMany(models.Label);
      }
    }
  });

  return LineItem;
};