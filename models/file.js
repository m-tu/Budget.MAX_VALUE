'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('File', {
    googleDriveId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: DataTypes.STRING,
    thumbnailData: DataTypes.BLOB,
    thumbnailType: DataTypes.STRING,
    embedLink: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  });
};