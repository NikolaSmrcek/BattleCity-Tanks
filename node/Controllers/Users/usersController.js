var logger = require(`${global.nodeDirectory}/libs/logger.js`),
    lodash = require("lodash");


class usersController {

    constructor(config) {
        this.config = config;
        this.users = new Array();
    }

    addUser(user = null, callback = () => {}) {
        if (!user) return callback("Can't add null object to users.");
        this.users.push(user);
        callback(null);
    }

    removeUser(user = null, callback = () => {}) {
        if (!user) return callback("Can't remove null object from users.");
        //TODO test
        lodash.remove(this.users, (userFromArray) => {
            return userFromArray == user;
        });
        callback(null);
    }

    //true if taken
    isUserNameTaken(userName = "", callback = () => {}) {
        if (userName = "") return callback("Empty string not allowed for userName.");
        let index = lodash.findIndex(this.users, (user) => {
            return user.userName == userName });
        //return index === -1;
        callback(null, (index !== -1));
    }

    getUserBySocketId(socketId, callback = () => {}) {
        if (!socketId) return callback("Must send socket id");
        let index = lodash.findIndex(this.users, (user) => {
            return user.socketId.toString() == socketId.toString() });
        //return this.users[index];
        callback(null, this.users[index]);
    }

    canJoinQueue(socketId = null, callback = () => {}) {
        this.getUserBySocketId(socketId, (err, user) => {
            if (!user) return callback("Non existing user.");
            //return user.queueDodges < this.config.queueDodges;
            return callback(null, (user.queueDodges < this.config.maxQueueDodges));
        });
    }

    getUsers(callback = () => {}) {
        return callback(null, this.users);
    }

}

module.exports = usersController;
