var fork = require('child_process').fork;

var subProcess = fork('sub.js');

subProcess.on('message',function(msg){
	console.log('got message from sub process:',msg);
});

subProcess.send('{name:"parent"}');
