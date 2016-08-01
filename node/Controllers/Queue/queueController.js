class queueController {

    constructor(queueModel = null) {
        this.logger = require(`${global.nodeDirectory}/libs/logger.js`);
        this.lodash = require("lodash");
        if (!queueModel) return this.logger.error("QueueModel is null cannot initilize queueController.");
        this.queueModel = queueModel;
    }

    addMember(member, callback = () => {}){
    	this.queueModel.addUser(member, callback);
    }

    removeMember(member, callback = () => {}){
    	this.queueModel.removeUser(member, callback);
    }

    //TODO cron job + search for members and notify them if found match

}

module.exports = queueController;
