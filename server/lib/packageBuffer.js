
var events = require('events');

function PackageBuffer(size){
	this._emitter = new events.EventEmitter();
	this._size = size;
	this._headLength = 4;
	this._buffer = new Buffer(this._size);
	this._pos = 0;
	this._bodyLength = 0;
}

PackageBuffer.prototype.add = function(data){
	data.copy(this._buffer, this._pos);
	this._pos += data.length;

	while(true){
		if (this._bodyLength === 0 && this._pos > this._headLength) {
			this._bodyLength = this._buffer.readInt32LE(0);
		}
		else{
			break;
		}

		if (this._bodyLength > 0
			&& this._pos >= this._bodyLength + this._headLength) {

			this._emitter.emit('package'
				,this._buffer.slice(4, this._bodyLength + this._headLength)
			);

			this._buffer.copy(this._buffer
				, 0
				, this._headLength + this._bodyLength
				, this._pos
			);

			this._pos = this._pos - this._headLength - this._bodyLength;
			this._bodyLength = 0;
		}
		else{
			break;
		}
	}

}

PackageBuffer.prototype.on = function(event, listener){
	this._emitter.on(event, listener);
}

PackageBuffer.packageData = function(data){
	var buffer = new Buffer(4 + data.length);
	buffer.writeInt32LE(data.length,0);
	data.copy(buffer,4,data.length);
	return buffer;
}

module.exports = PackageBuffer;
