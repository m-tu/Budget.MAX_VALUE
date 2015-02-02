'use strict';

module.exports = function(sequelize, DataTypes) {
  var File = sequelize.define('File', {
    googleDriveId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: DataTypes.STRING,
    thumbnailLink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    embedLink: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  });

  return File;
};