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

var clientsNumber = 0 ;
var clients = new Array();
var Server = function(maxConnections,host,port){
  this.maxConnections = maxConnections ;
  this.host = host ;
  this.port = port ;
  this.path = this.host + ':' + this.port;
  this.status = new ServerStatus() ;
  this.eventEmitter = new events.EventEmitter();
};

Server.prototype.start = function(){
  if(this.status.isStarted()){
    return;
  }

  console.log('begin to start');
  var that = this;
  this.server = net.createServer(function(){

  });

  this.server.on('connection',function(socket){
    var sc = new SocketChannel(socket);
    sc.on('package',function(pkg){
      that.eventEmitter.emit('package', {'pkg':pkg,'remoteAddress':sc.remoteIPEndPoint});
    });
    sc.on('close',function(){
      that.eventEmitter.emit('close', {'remoteAddress':sc.remoteIPEndPoint});
      for(var i = 0 ; i < clients.length; ++i){
        if(clients[i] === sc){
          clients.removeAt(i);
          break;
        }
      }
    });
    clients.push(sc);
    clientsNumber += 1;
    that.eventEmitter.emit('connection',{'remoteAddress':sc.remoteIPEndPoint})
  });

  this.server.on('close',function(){
      console.log('server stopped at' , that.path);
  });

  this.server.listen(this.port,this.host, 100, function(){
    console.log('server started at' , that.path);
  });
};

Server.prototype.stop = function(){
  console.log('begin to stop');
  while(clients.length > 0){
    var sc = clients.pop();
    sc.close('server is stopping\n');
    clientsNumber -= 1;
  }
  this.server.close();
};

Server.prototype.getClientsNumber = function(){
  return clientsNumber;
}

Server.prototype.on = function(event,handle){
  this.eventEmitter.on(event,handle);
}

Server.prototype.off = function(event,handle){
  this.eventEmitter.removeEventListener(event,handle);
}


module.exports = Server;
