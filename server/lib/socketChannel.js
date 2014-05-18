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


var SocketChannel = function(socket,bufferSize){
	this.socket = socket;
	this.remoteAddress = socket.remoteAddress;
	this.remotePort = socket.remotePort;
	this.remoteIPEndPoint = this.remoteAddress + ':' + this.remotePort;
	this.eventEmitter = new events.EventEmitter();
	this.socketStatus = new SocketChannelStatus();

	if(!bufferSize){
		bufferSize = 1024;
	}
	var buffer = new PackageBuffer(bufferSize);
	var dataTimes = 0 ;
	var that = this;
	buffer.on('package',function(pkg){
		that.eventEmitter.emit('package',pkg);
		dataTimes = 0;
	});

	this.socket.on('data',function(data){
		buffer.add(data);
		dataTimes += 1;
		if(dataTimes >= 4){
			that.close();
		}
	});
}

SocketChannel.prototype.on = function(event,handler){
	this.eventEmitter.on(event,handler);
}


SocketChannel.prototype.send = function(msg){
	var that = this;
	var sendData = function(pkg){
		that.socketStatus.setSending();
		that.socket.write(pkg,'utf-8',function(){
			that.socketStatus.setSent();
			that.eventEmitter.emit('sent',msg);
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

SocketChannel.prototype.close = function(msg){
	if(this.socket){
		this.socket.end(msg);
		this.socket = null;
		this.eventEmitter.emit('close',{'this':this})
	}
}

module.exports = SocketChannel;
