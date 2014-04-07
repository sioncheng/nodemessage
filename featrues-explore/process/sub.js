
process.on('message',function(msg){
	console.log('got message from parent:',msg);
});

process.send('{name:"child"}');

//console.log(process);
