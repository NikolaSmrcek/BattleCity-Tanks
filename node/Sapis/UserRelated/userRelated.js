var sapis = require(global.nodeDirectory + '/Models/Sockets/meta/sapis.js'),
    logger = require(`${global.nodeDirectory}/libs/logger.js`),
    async = require('async'),
    UsersModel = require(global.nodeDirectory + '/Models/Users/usersModel.js');



exports[sapis.userName] = ({ socket, data, emitter, usersController }) => {
    if (!data && !data.userName) return logger.error("Data not provided for userName sapi.");
    async.waterfall([
        (next) => {
            usersController.isUserNameTaken(data.userName, next);
        },
        (taken, next) => {
            if (!taken) {
                usersController.addUser(new UsersModel(data.userName, socket.id, usersController.config.playerDodgeQueueInterval), next);
                emitter.emit(socket, "userName", { status: 200, message: `User registrated with provided userName (${data.userName})` });
            } else {
                emitter.emit(socket, "userName", { status: 400, message: "User name is taken, please provide another." });
                next(null);
            }
        }
    ], (err) => {
        if (err) {
            logger.warn(err);
        }
    });
};
