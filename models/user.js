'use strict';

export default function(sequelize, DataTypes) {
  let User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate(models) {
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