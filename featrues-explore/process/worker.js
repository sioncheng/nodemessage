var http = require('http')

var port = Math.ceil(100  * Math.random() * Math.random()) + 8000 


console.log('http server started at ' + port);

http.createServer(function(req,res){
	
	res.writeHead(200,{'Content-type':'text/plain'});
	res.end('hello world!\n');

}).listen(port);
