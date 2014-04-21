var SocketChannel = require('../lib/socketChannel.js');

var socketChannels = new Array();

var onpakcage = function(pkg){
	
}

process.on('message',function(message,handle){
	if (message === 'socket'){
		var socketChannel = new SocketChannel(handle);
		socketChannels.push(socketChannel);
	}
});