class gameQueueModel {

	constructor(){
		this.queueMembers = new Array();
		this.logger = require(`${global.nodeDirectory}/libs/logger.js`);
		this.lodash = require('lodash');
	}

	getQueue(callback = () => {}){
		//return this.queueMembers;
		return callback(null, this.queueMembers);
	}

	addUser(user = null, callback = () => {}){
		if(!user) return callback("Can't add null object to queue.");
		this.queueMembers.push(user);
		return callback(null);
	}

	removeUser(user = null, callback = () => {}){
		if(!user) return callback("Can't remove null object from queue.");
		//TODO test
		this.lodash.remove(this.queueMembers, (userFromArray) =>{
			return userFromArray == user;
		});
		return callback(null);
	}

}

module.exports = gameQueueModel;