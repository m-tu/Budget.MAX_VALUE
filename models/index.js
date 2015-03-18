'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import baseConfig from '../config/config.json';

let basename = path.basename(module.filename);
let env = process.env.NODE_ENV || 'development';
let config = Object.assign(baseConfig[env], {
  timestamp: false
});


let sequelize = new Sequelize(config.database, config.username, config.password, config);
let db = {};

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename)
  .forEach(file => {
    let model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

for (let modelName of Object.keys(db)) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
