var net = require('net');
var path = require('path');
var events = require('events');

var SocketChannel = require(path.join(__dirname,'socketChannel.js'));
var PackageBuffer = require(path.join(__dirname,'packageBuffer.js'));

//
var socket = null;
var packageBuffer = new PackageBuffer();
var eventEmitter = new events.EventEmitter();
var dataTimes = 0;

var Client = function(port,host){
  this.port = port;
  if(host){
    this.host = host;
  }
  else{
    this.host = 'localhost';
  }
  this.remoteIPEndPoint = this.host + ':' + this.port;
}

Client.prototype.connect = function(){
  var that = this;
  packageBuffer.on('package',function(pkg){
    eventEmitter.emit('package',
      {'package':pkg,'remoteIPEndPoint':this.remoteIPEndPoint}
    );
    dataTimes = 0;
  });

  socket = net.connect(this.port,this.host,function(){
    eventEmitter.emit('connect',{'remoteIPEndPoint':this.remoteIPEndPoint});
  });
  socket.on('data',function(data){
    packageBuffer.add(data);
    dataTimes += 1;
    if(dataTimes >= 3){
      that.close();
    }
  });
  socket.on('end',function(){
    eventEmitter.emit('close',{'remoteIPEndPoint':this.remoteIPEndPoint});
  });
}

Client.prototype.send = function(data){
  var that = this;
  socket.send(data,function(){
    eventEmitter.on('send',
      {'data':data,'remoteIPEndPoint':that.remoteIPEndPoint}
    );
  });
}

Client.prototype.close = function(){
  socket.end('');
}

Client.prototype.on = function(event,listener){
  eventEmitter.on(event,listener);
}

Client.prototype.off = function(event,listener){
  eventEmitter.removeEventListener(event,listener);
}

module.exports = Client;
