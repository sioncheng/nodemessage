
var Server = require('./../../lib/server.js');
var net = require('net');

describe('#Server',function(){
  it('should started',function(done){
    //done();

    var server = new Server(1000,'127.0.0.1',8080) ;
    server.on('connection',function(param){
      if(server.getClientsNumber() === 1){
        done();
        server.stop();
      };
    });
    server.start();

    net.connect({'host':'127.0.01','port':8080},function(){
      console.log('connected to 127.0.0.1:8080');
    });
  });
});
