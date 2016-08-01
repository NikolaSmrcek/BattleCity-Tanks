class GameModel {

    constructor(id, config) {
        this.id = id;
        this.config = config;
        this.gameMembers = new Array();
        this.lodash = require('lodash');
    }

    getMembers(callback = () => {}) {
        return callback(null, this.gameMembers);
    }

    addMember(member = null, callback = () => {}) {
        if (!member) return callback("Member cannot be null.");
        if (this.gameMembers.length < this.config.maxGameMembers) {
            this.gameMembers.push(this.lodash.cloneDeep(member));
            return callback(null);
        } else {
            return callback("Cannot add anymore members, game has allready max members.");
        }
    }

    getMember(member = null, callback = () => {}) {
        if (!member) return callback("Member cannot be null.");
        let index = this.lodash.findIndex(this.gameMembers, (user) => {
            return user.socketId == member.socketId });
        return callback(null, this.gameMembers[index]);
    }

    removeMember(member = null, callback = () => {}) {
        if (!member) return callback("Member cannot be null.");
        this.lodash.remove(this.gameMembers, (userFromArray) => {
            return userFromArray.sockerId == member.sockerId;
        });
        return callback(null);
    }

}

module.exports = GameModel;
