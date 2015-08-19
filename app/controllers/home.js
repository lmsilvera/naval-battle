var utils = require('../../lib/utils');

exports.index = function (req, res) {
  res.render('index', {
    title: 'Home'
  });
};
