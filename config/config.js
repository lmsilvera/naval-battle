var path        = require('path'),
    extend      = require('util')._extend,
    development = require('./env/development');

var defaults = {
  root: path.join(__dirname, '..')
};

module.exports = {
  development: extend(development, defaults)
}[process.env.NODE_ENV || 'development'];

