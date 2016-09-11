var sapis = require(global.nodeDirectory + '/Models/Sockets/meta/sapis.js'),
    logger = require(`${global.nodeDirectory}/libs/logger.js`),
    async = require('async'),
    UsersModel = require(global.nodeDirectory + '/Models/Users/usersModel.js');



exports[sapis.userName] = ({ socket, data, emitter, usersController }) => {
    if (!data) return logger.error("Data not provided for userName sapi.");
    signUser(socket, data, emitter, usersController);
};

exports[sapis.setStatus] = ({ socket, data, emitter, usersController }) => {
    if (!data) return logger.error("Data not provided for userName sapi.");
    async.waterfall([
        next => {
            usersController.getUserBySocketId(socket.id, next);
        },
        (user, next) => {
            if(!user) return next("Could not find user with given socketid!");
            user.setStatus(data.status,next);
        }
    ], (err) => {
        if(err) logger.warn(err);
    });
};

var signUser = function(socket, data, emitter, usersController) {
    let userName = "";
    async.waterfall([
        (next) => {
            userName = data.userName || "Player " + Math.floor((Math.random() * 10000) + 1);
            next(null, userName);
        },
        (userName, next) => {
            usersController.isUserNameTaken(userName, next);
        },
        (taken, next) => {
            if (!taken) {
                usersController.addUser(new UsersModel(userName, socket, usersController.config.playerDodgeQueueInterval), next);
                emitter.emit(socket, "userName", { status: 200, message: `User registrated with provided userName (${userName})`, userName: userName });
            } else if (data.userName && taken) {
                emitter.emit(socket, "userName", { status: 400, message: "User name is taken, please provide another." });
                next(null);
            } else if (!data.userName && taken) {
                signUser(socket, data, emitter, usersController);
            }
        }
    ], (err) => {
        if (err) {
            logger.warn(err);
        }
    });
};
