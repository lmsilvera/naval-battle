var fs = require('fs'),
    join = require('path').join,
    express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('config');

var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = process.env.PORT || 3000;

server.listen(port);

var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

fs.readdirSync(join(__dirname, 'app/models')).forEach(function (file) {
  if (~file.indexOf('.js')) require(join(__dirname, 'app/models', file));
});

require('./config/passport')(passport, config);
require('./config/express')(app, passport);
require('./config/routes')(app, passport);
require('./config/sockets')(io, server);

module.exports = app;

