var fork = require('child_process').fork;
var path = require('path');

var workers = require('os').cpus().length;
var server = require('net').createServer();
var dir = (function(){
  var filename = process.mainModule.filename;
  return path.dirname(filename);
})();

var child_processes = new Array();
for(var i = 0 ; i < workers; ++i){
  child_processes.push(fork(path.join(dir,'server_balance_worker.js')));
  console.log('forked ',child_processes[i].pid);
}

console.log('begin to start server');
server.listen(8000,function(){
  for(var i = 0 ; i < workers; ++i){
    child_processes[i].send('server',server);
    console.log('send server handle to ',child_processes[i].pid);
  }

  console.log('finished');
  server.close();
});
