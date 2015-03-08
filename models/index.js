'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import baseConfig from '../config/config.json';

var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || 'development';
var config = baseConfig[env];

config.define = {
  timestamps: false
};

var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
