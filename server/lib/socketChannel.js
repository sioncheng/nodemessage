var net = require('net');
var buffer = require('buffer');
var events = require('events');

var SocketChannel = function(socket,messageParser){
	this.socket = socket;
	events.EventEmmiter.call(this);

	//buffers
	this.data = new Buffer();
	this.dataPos = 0;

	this.socket.on('data',function(data){
		data.copy(this.data,this.dataPos);
		this.dataPos += data.length;

		this._checkPackage();
	});
}

SocketChannel.prototype.on = function(event,handler){
	this.eventEmmiter.addEventListener(event,handler);
}

SocketChannel.prototype._checkPackage = function(){
	if(this.dataPos > 4){
		
	}
}

SocketChannel.prototype.send = function(message){
	
}

module.exports.SocketChannel = SocketChannel;