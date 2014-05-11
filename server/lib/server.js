var net = require('net');
var path = require('path');
var events = require('events');

var SocketChannel = require(path.join(__dirname,'socketChannel.js'));
var PackageBuffer = require(path.join(__dirname,'packageBuffer.js'));

var ServerStatus = function(){
  this.status = 'init';
};

ServerStatus.prototype.setStarted = function(){
  if(this.status === 'init'){
    this.status = 'started';
  }
  else{
    throw new Error('serve cant be started multiple times');
  }
};

ServerStatus.prototype.isStarted = function(){
  return this.status === 'started';
};

var Server = function(maxConnections,ip,port){
  this.maxConnections = maxConnections ;
  this.ip = ip ;
  this.port = port ;
  this.path = this.ip + ':' + this.port;
  this.status = new ServerStatus() ;
  this.server = null;
  this.clients = null;
  this.eventEmitter = new events.EventEmitter();
};

Server.prototype.start = function(){
  if(this.status.isStarted()){
    return;
  }

  console.log('begin to start');

  this.clients = new Array();

  var that = this;


  this.server = net.createServer(function(){

  });

  this.server.on('connection',function(socket){
    var sc = new SocketChannel(socket);
    that.clients.push(sc);
    that.eventEmitter.emit('connection',{'sc':sc,'num':that.clients.length})
  });

  this.server.on('close',function(){
      console.log('server stopped at' , that.path);
  });

  this.server.listen(this.port,this.ip, 100, function(){
    console.log('server started at' , that.path);
  });
};

Server.prototype.stop = function(){
  console.log('begin to stop');
  while(this.clients.length > 0){
    (this.clients.pop()).close('server is stopping\n');
  }
  this.server.close();
};

Server.prototype.getClientsNumber = function(){
  return this.clients.length;
}

Server.prototype.on = function(event,handle){
  this.eventEmitter.on(event,handle);
}

Server.prototype.off = function(event,handle){
  this.eventEmitter.removeEventListener(event,handle);
}


module.exports = Server;
