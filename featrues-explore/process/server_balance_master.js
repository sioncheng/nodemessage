var fork = require('child_process').fork;
var workers = require('os').cpus().length;
var server = require('net').createServer();

var child_processes = new Array();

for(var i = 0 ; i < workers; ++i){
  child_processes.push(fork('server_balance_worker.js'));
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
