var SocketChannel = require('./../../lib/SocketChannel.js');
var net = require('net');

describe('#SocketChannel',function(){
	it('should get 2 packages',function(done){
	    var c = 0 ;
		var server = net.createServer();
		var socketChannels = new Array();
		server.on('connection',function(socket){
			var sc = new SocketChannel(socket);
			sc.on('package',function(pkg){
				c++;
				if(c === 2){
					for(var i = 0 ; i < socketChannels.length; ++i){
						socketChannels[i].close();
					}
					done();
				}
			});
			socketChannels.push(sc);
		});
		server.listen(8001);

		var msg1 = new Buffer("hello") ;
		var msg2 = new Buffer("hahaha") ;
		var buf = new Buffer(4 + msg1.length + 4 + msg2.length);
		buf.writeInt32LE(msg1.length,0);
		msg1.copy(buf, 4);
		buf.writeInt32LE(msg2.length, 4 + msg1.length);
		msg2.copy(buf, 4 + msg1.length + 4);
		var conn1 = new net.Socket();
		conn1.connect(8001,"127.0.0.1",function(){
			conn1.write(buf);
		}).on('close',function(){}).on('error',function(){});
	});
});