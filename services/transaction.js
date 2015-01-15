'use strict';

var models  = require('../models');

module.exports = {
  name: 'transaction',
  read: function (req, resource, params, config, callback) {
    var user = req.session.user;

    if (!user) {
      return callback(403);
    }

    models.Transaction.findAll({
      where: {
        UserId: user.id
      }
    }).then(function(transactions) {
      callback(null, transactions);
    });
  }
};
