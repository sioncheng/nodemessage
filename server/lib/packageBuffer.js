
var events = require('events');

function PackageBuffer(size){
	this.emitter = new events.EventEmitter();
	if(!size){
		size = 512;
	}
	this.size = size;
	this.headLength = 4;
	this.buffer = new Buffer(this.size);
	this.pos = 0;
	this.bodyLength = 0;
}

PackageBuffer.prototype.add = function(data){
	data.copy(this.buffer, this.pos);
	this.pos += data.length;

	while(true){
		if (this.bodyLength === 0 && this.pos > this.headLength) {
			this.bodyLength = this.buffer.readInt32LE(0);
		}
		else{
			break;
		}

		if (this.bodyLength > 0
			&& this.pos >= this.bodyLength + this.headLength) {

			this.emitter.emit('package'
				,this.buffer.slice(4, this.bodyLength + this.headLength)
			);

			this.buffer.copy(this.buffer
				, 0
				, this.headLength + this.bodyLength
				, this.pos
			);

			this.pos = this.pos - this.headLength - this.bodyLength;
			this.bodyLength = 0;
		}
		else{
			break;
		}
	}

}

PackageBuffer.prototype.on = function(event, listener){
	this.emitter.on(event, listener);
}

PackageBuffer.packageData = function(data){
	var buffer = new Buffer(4 + data.length);
	buffer.writeInt32LE(data.length,0);
	data.copy(buffer,4,data.length);
	return buffer;
}

module.exports = PackageBuffer;
