process.on('message',function(message,handle){
  if (message === 'socket') {
    handle.end('handled by child\n');
  }
});
