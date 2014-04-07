process.on('message',function(message,handle){
  if (message === 'server'){
    handle.on('connection',function(socket){
      console.log('i am handling the request',process.pid);
      socket.end('handled by ' + process.pid + '\n');
    });
  }
});
