var async = require('async'),
    mongo = require('mongodb'),
    logger = require(`${global.nodeDirectory}/libs/logger.js`),
    lodash = require("lodash"),
    moment = require('moment');

class GameModel {

    constructor(config) {
        this.config = config;
        this.gameMembers = new Array();

        this.created = moment().unix();
        this.lastAddedMember = moment().unix();;
        this.status = "created";
        this.inviteVotes = {};
        this._setId();
    }

    getId(callback = () => {}) {
        return callback(null, this.id);
    }

    _setId() {
        this.id = new mongo.ObjectID();
    }

    setStatus(status = null, callback = () => {}) {
        this.status = status;
        return callback(null);
    }

    getStatus(callback = () => {}) {
        return callback(null, this.status);
    }

    getInviteVotes(callback=()=>{}){
        return callback(null,this.votes);
    }

    _checkQueueWaitingTime(callback = () => {}) {
        this.getStatus((err, status) => {
            let playable = (((moment().unix() - this.lastAddedMember) > this.config.queueMemberWaiting) && (this.gameMembers.length >= this.config.minGameMembers) && (status == "inqueue"));
            return callback(null, playable);
        });
    };

    getMembers(callback = () => {}) {
        return callback(null, this.gameMembers);
    }

    getMembersLength(callback = () => {}) {
        return callback(null, this.gameMembers.length);
    }

    addMember(member = null, callback = () => {}) {
        if (!member) return callback("Member cannot be null.");
        if (this.gameMembers.length < this.config.maxGameMembers) {
            //this.gameMembers.push(lodash.cloneDeep(member));
            this.gameMembers.push(member);
            this.lastAddedMember = moment().unix();
            member.setStatus("inqueue",callback);
            //return callback(null);
        } else {
            return callback("Cannot add anymore members, game has allready max members.");
        }
    }

    getMember(member = null, callback = () => {}) {
        if (!member) return callback("Member cannot be null.");
        let index = lodash.findIndex(this.gameMembers, (user) => {
            return user.socketId == member.socketId;
        });
        return callback(null, this.gameMembers[index]);
    }

    removeMember(member = null, callback = () => {}) {
        if (!member) return callback("Member cannot be null.");
        lodash.remove(this.gameMembers, (userFromArray) => {
            return userFromArray.socketId == member.socketId;
        });
        return callback(null);
    }

    setMemberQueueVote(socketId, answer, callback=()=>{}){
        this.getInviteVotes((err,object)=>{
            if(socketId.toString() in object) return callback("Player with that socketId allready answered the queue.");
            object[socketId] = answer;
            return callback(null);
        });
    }

}

module.exports = GameModel;
