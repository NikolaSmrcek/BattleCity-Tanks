var logger = require(`${global.nodeDirectory}/libs/logger.js`),
    lodash = require("lodash"),
    async = require('async');


class gameQueueModel {

    constructor() {
        this.queueMembers = new Array();
    }

    getQueue(callback = () => {}) {
        return callback(null, this.queueMembers);
    }

    addUser(user = null, callback = () => {}) {
        if (!user) return callback("Can't add null object to queue.");
        //TODO get queueMembers async
        async.waterfall([
            (next) => {
                user.getStatus(next);
            },
            (status, next) => {
                //TODO move this to config status === "web"
                if (status === "online") {
                    let index = lodash.findIndex(this.queueMembers, (member) => {
                        user.socketId.toString() == member.socketId.toString();
                    });
                    if (index === -1) {
                        this.queueMembers.push(user);
                        return next(null);
                    } else {
                        return next("Player is allready in queue list.");
                    }
                } else {
                    return next("Player is in game or inqueue allready (has assigned game).");
                }
            }
        ], (err) => {
            if (err) {
                return callback(err)
            }
        });
    }

    removeUser(user = null, callback = () => {}) {
        if (!user) return callback("Can't remove null object from queue.");
        lodash.remove(this.queueMembers, (userFromArray) => {
            return userFromArray.socketId == user.socketId;
        });
        return callback(null);
    }

}

module.exports = gameQueueModel;
