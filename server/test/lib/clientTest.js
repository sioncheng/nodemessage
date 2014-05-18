var net = require('net');
var path = require('path');

var Client = require(path.join(__dirname, '../../lib/client.js'));
var PackageBuffer = require(path.join(__dirname,'../../lib/packageBuffer.js'));

describe('client',function(){
  it('#should receive a package',function(done){

    var server = net.createServer(function(){

    });
    server.on('connection',function(socket){
      socket.write(PackageBuffer.packageData(new Buffer('hello')));
    });
    server.listen(8080,function(){

    });

    var client = new Client(8080);
    client.on('package',function(){
      done();

      client.close();
      server.close();
    })
    client.connect();
  });
});
