const io = require('socket.io');

io.on('connection', (socket) => {
    console.log('client connesso!');
    socket.emit('connection', null)
  });

  module.exports = io;