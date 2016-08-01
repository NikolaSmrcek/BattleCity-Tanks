/**
 * Model used for emitting various socket messages
 */
var _ = require('lodash');

var logger = require(`${global.nodeDirectory}/libs/logger.js`);

class SocketEmitter {
	constructor(io) {
		this.io = io;
	}

	emit(channelOrSocket, messageType, messageBody) {
		if ( typeof channelOrSocket == "string" ) {
		    let channel = channelOrSocket;
            this.io.in(channel).emit(messageType, messageBody );
        } else if ( channelOrSocket.id ) {
            let socket = channelOrSocket;
            //logger.info(`Emitting to socketId ${socket.socketId} channel message ${messageType}`);
            this.io.in(socket.id).emit(messageType, messageBody);
        } else {
            logger.error(`Unable to emit message ${messageType} because no channel or socket was provided`);
        }
	}

	emitToAll(messageType, messageBody) {
		this.io.emit(messageType, messageBody);  // emits to all connected clients
	}
}

module.exports = SocketEmitter;