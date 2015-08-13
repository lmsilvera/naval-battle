var express = require('express'),
    path = require('path'),
    app = express(),
    server =  require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
  socket.on('send_attack', function(data){
    io.sockets.emit('listen_attack', data);
  });
  socket.on('received_attack', function(data){
    io.sockets.emit('received_attack?', data);
  });
});
