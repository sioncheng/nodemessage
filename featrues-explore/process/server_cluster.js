var cluster = require('cluster');
var http = require('http');
var num = require('os').cpus().length;

if(cluster.isMaster){
	console.log('master starting...');
	for(var i = 0 ; i < num; ++i){
		cluster.fork();
	}

	cluster.on('listening',function(worker,address){
		console.log('listening: worker ' + worker.process.pid + ', address: ' + address.address + ":" + address.port);
	});

	cluster.on('exit',function(worker,code,signal){
		console.log('worker ' + worker.process.pid + ' died');
	});
}
else{
	http.createServer(function(req,res){
		var msg = 'hello from ' + process.pid + '\n';
		res.writeHead(200,'{Content-type:"text/plain"}');
		res.end(msg);
		console.log(msg);
	}).listen(8080);
}