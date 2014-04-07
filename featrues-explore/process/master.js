var fork = require('child_process').fork;

var cpus = require('os').cpus();

console.log('begin to start ' + cpus.length + ' worker.js');

for(var i = 0 ; i < cpus.length; ++i){
	fork('./worker.js');
}