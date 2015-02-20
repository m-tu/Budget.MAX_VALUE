'use strict';

module.exports = function(sequelize, DataTypes) {
  var Label = sequelize.define('Label', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Label.belongsToMany(models.Item);
      }
    }
  });

  return Label;
};