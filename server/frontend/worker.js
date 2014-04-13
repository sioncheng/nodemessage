var SocketChannel = require('../lib/socketChannel.js');

var socketChannels = new Array();

process.on('message',function(message,handle){
	if (message === 'socket'){
		var socketChannel = new SocketChannel(handle);
		socketChannels.push(socketChannel);
	}
});