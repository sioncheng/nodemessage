var child = require('child_process').fork('server_worker.js');

var server = require('net').createServer();

server.on('connection',function(socket){
  console.log('send socket handle to child process\n');
  child.send('socket',socket);
});

server.listen(8000,function(){
  console.log('listening in master process\n');
});
