'use strict';

module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10, 2)
  }, {
    classMethods: {
      associate: function(models) {
        Item.belongsToMany(models.Label);
      }
    }
  });

  return Item;
};