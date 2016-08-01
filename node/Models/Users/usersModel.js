class UserModel {

	constructor(userName, socketId, db = null){
		this.userName = userName;
		this.socketId = socketId;
		this.queueDodges = 0;
		this.db = db; //TODO maybe later we will need this
		this.logger = require(`${global.nodeDirectory}/libs/logger.js`);
	}

	getUserName(){
		return this.userName;
	}

	getSocketId(){
		return this.socketId;
	}

	getQueueDodges(){
		return this.queueDodges;
	}

	setQueueDodges(_queueDodges){
		this.queueDodges = _queueDodges;
	}

	incrementQueueDodges(_queueDodges = 1){
		this.queueDodges += _queueDodges;
	}

}

module.exports = UserModel;