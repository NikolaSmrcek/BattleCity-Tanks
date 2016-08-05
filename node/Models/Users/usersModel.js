var logger = require(`${global.nodeDirectory}/libs/logger.js`);

class UserModel {

    constructor(userName, socketId, clearDodges, db = null) {
        this.userName = userName;
        this.socketId = socketId;
        this.queueDodges = 0;
        this.clearDodges = clearDodges;
        this.status = "online";
        this.db = db; //TODO maybe later we will need this
    }

    getUserName(callback = () => {}) {
        return callback(null, this.userName);
    }

    getSocketId(callback = () => {}) {
        return callback(null, this.socketId);
    }

    getQueueDodges(callback = () => {}) {
        return callback(null, this.queueDodges);
    }

    setQueueDodges(_queueDodges, callback = () => {}) {
        this.queueDodges = _queueDodges;
        return callback(null);
    }

    incrementQueueDodges(callback = () => {}) {
        this.queueDodges += 1;
        this._clearQueueDodges();
        this.setStatus("online", callback);
    }

    getStatus(callback=()=>{}){
        return callback(null, this.status);
    }

    setStatus(status, callback=()=>{}){
        this.status = status;
        return callback(null);
    }

    _clearQueueDodges() {
        setTimeout(() => {
            this.queueDodges = 0;
        }, this.clearDodges);
    }

}

module.exports = UserModel;
