//use mocha to do unit test

var path = require('path');
var PackageBuffer = require(path.join(__dirname, '../../lib/packageBuffer.js'));


describe('packageBuffer', function(){
	it('#add(),should emmit 2 packages', function(done){
		var msg = 'hello nodejs';
		var c = 0 ;
		var eq = false;
		var pb = new PackageBuffer(2048);

		pb.on('package', function(p){
			eq = (p.toString() === msg);
			if(++c == 2 && eq){
				done();
			}
		});

		var msgBuffer = new Buffer(msg);
		var bf = new Buffer(4 + msgBuffer.length);
		bf.writeInt32LE(msgBuffer.length, 0);
		msgBuffer.copy(bf, 4);

		pb.add(bf);
		pb.add(bf);
	});
});