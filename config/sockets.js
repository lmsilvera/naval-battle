module.exports = function (io, server) {

  io.sockets.on('connection', function(socket){

    socket.on('send_attack', function(data){
      io.sockets.emit('listen_attack', data);
    });

    socket.on('received_attack', function(data){
      io.sockets.emit('received_attack?', data);
    });

  });

}
