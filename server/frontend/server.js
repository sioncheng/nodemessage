var net = require('net');
var os = require('os');
var childProcess = require('child_process');
var path = require('path');

var childProcessArr = new Array();
for(var i = 0 ; i < os.cpus().length - 1; ++i){
	childProcessArr.push(childProcess.fork(path.jion(__dirname,'worker.js')));
}

var server = net.createServer();
var count = 0;
server.on('connection',function(socket){
	childProcessArr[count].send('socket',socket);
	count = (count + 1) % 4;
});

server.listen(9000);
