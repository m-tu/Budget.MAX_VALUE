'use strict';

module.exports = function(sequelize, DataTypes) {
  var File = sequelize.define('File', {
    name: DataTypes.STRING,
    size: DataTypes.INTEGER,
    type: DataTypes.STRING,
    data: DataTypes.BLOB('medium')
  });

  return File;
};