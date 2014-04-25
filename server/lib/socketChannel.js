var net = require('net');
var events = require('events');
var PackageBuffer = require('./packageBuffer.js');

var SocketChannelStatus = function(){
	this.status = 'init';
}

SocketChannelStatus.prototype.setSending = function(){
	this.status = 'sending';
}

SocketChannelStatus.prototype.setSent = function(){
	this.status = 'sent';
}

SocketChannelStatus.prototype.isSendable = function(){
	return this.status !== 'sending';
}


var SocketChannel = function(socket){
	this.socket = socket;
	this.eventEmmiter = new events.EventEmitter();
	this.buffer = new PackageBuffer(1024);
	this.socketStatus = new SocketChannelStatus();

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


SocketChannel.prototype.send = function(msg){
	var that = this;
	var sendData = function(pkg){
		that.socketStatus.setSending();
		that.socket.write(pkg,'utf-8',function(){
			that.socketStatus.setSent();
			that.eventEmmiter.emit('sent',msg);
			that.socketStatus.setSent();
		});
	}

	if(this.socketStatus.isSendable()){
		sendData(PackageBuffer.packageData(msg['data']));
	}
	else{
		this.eventEmitter.emit("error"
			,{"msg":"the socket channel is not ready for send","identifer":identifier}
		);
	}
}

SocketChannel.prototype.close = function(){
	if(this.socket){
		this.socket.end();
	}
}

module.exports = SocketChannel;
