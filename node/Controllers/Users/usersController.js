class usersController{

	constructor(config){
		this.config = config;
		this.users = new Array();
		this.logger = require(`${global.nodeDirectory}/libs/logger.js`);
		this.lodash = require("lodash");
	}

	addUser(user = null, callback = () => {}){
		if(!user) return callback("Can't add null object to users.");
		this.users.push(user);
		callback(null);
	}

	removeUser(user = null, callback = ()=>{}){
		if(!user) return callback("Can't remove null object from users.");
		//TODO test
		this.lodash.remove(this.users, (userFromArray) =>{
			return userFromArray == user;
		});
		callback(null);
	}

	//true if taken
	isUserNameTaken(userName = "", callback = ()=>{}){
		if(userName = "") return callback("Empty string not allowed for userName.");
		let index = this.lodash.findIndex(this.users, (user) => { return user.userName == userName});
		//return index === -1;
		callback(null, (index === -1) );
	}

	getUserBySocketId(socketId, callback = ()=>{}){
		if(!socketId) return callback("Must send socket id");
		let index = this.lodash.findIndex(this.users, (user) => { return user.socketId == socketId});
		//return this.users[index];
		callback(null, this.users[index]);
	}

	canJoinQueue(socketId = null, callback = ()=>{}){
		let user = this.getUserBySocketId(socketId);
		if(!user) return callback("Non existing user.");
		//return user.queueDodges < this.config.queueDodges;
		callback(null, (user.queueDodges < this.config.maxQueueDodges) );
	}

}

module.exports = usersController;