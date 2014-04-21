var net = require('net');
var events = require('events');
var PackageBuffer = require('./packageBuffer.js');

var SocketChannel = function(socket){
	this.socket = socket;
	this.eventEmmiter = new events.EventEmitter();
	this.buffer = new PackageBuffer(1024);

	var that = this;
	this.buffer.on('package',function(pkg){
		that.eventEmmiter.emit('package',pkg);
	});

	var that = this;
	this.socket.on('data',function(data){
		that.buffer.add(data);
	});
}

SocketChannel.prototype.on = function(event,handler){
	this.eventEmmiter.on(event,handler);
}


SocketChannel.prototype.send = function(message){

}

SocketChannel.prototype.close = function(){
	if(this.socket){
		this.socket.end();
	}
}

module.exports = SocketChannel;