class gameQueueController {

    constructor(queueModel = null, config) {
        this.logger = require(`${global.nodeDirectory}/libs/logger.js`);
        this.lodash = require("lodash");
        this.async = require('async');
        if (!queueModel) return this.logger.error("QueueModel is null cannot initilize queueController.");
        this.queueModel = queueModel;
        this.interval = null;
        this.config = config;
    }

    addMember(member, callback = () => {}) {
        this.queueModel.addUser(member, callback);
    }

    removeMember(member, callback = () => {}) {
        this.queueModel.removeUser(member, callback);
    }

    checkQueue(callback = () => {}) {
        this.async.waterfall([], (err) => {
            (next) => {
                this.queueModel.getQueue(next);
            }
            (next, members) => {
                if(!members || members.length < 1) next("Members array is empty."); 
                //if there is members try to make a game
                //TODO gameController and gameModel
            }
            if (err) {
                this.logger.error(err);
            }
        });
    }

    startQueue(callback = () => {}) {
        this.interval = setInterval(this.checkQueue, this.config.queueInterval);
        callback();
    }

    stopQueue(callback = () => {}) {
            clearInterval(this.interval);
            callback();
        }
        //TODO cron job + search for members and notify them if found match

}

module.exports = gameQueueController;
