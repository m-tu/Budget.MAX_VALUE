'use strict';

module.exports = function(sequelize) {
  var LineItemLabel = sequelize.define('LineItemLabels');

  return LineItemLabel;
};