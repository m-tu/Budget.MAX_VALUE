'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Transaction, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });

        User.hasMany(models.Label, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
      }
    }
  });

  return User;
};