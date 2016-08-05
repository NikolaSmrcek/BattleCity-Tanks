var sapis = require(global.nodeDirectory + '/Models/Sockets/meta/sapis.js'),
    logger = require(`${global.nodeDirectory}/libs/logger.js`),
    async = require('async');


//User joined queue
exports[sapis.enterQueue] = ({ socket, data, emitter, gameQueueController, usersController }) => {
    async.waterfall([
        (next) => {
            usersController.canJoinQueue(socket.id, next);
        },
        (canJoinQueue, next) => {
            logger.log("SocketID wants to join queue: ", socket.id );
            if (canJoinQueue) {
                usersController.getUserBySocketId(socket.id, next);
            } else {
                next("User can't join queue, dodged too many games.");
            }
        },
        (user, next) => {
            gameQueueController.addMember(user,next);
        }
    ], (err) => {
        if (err) {
            logger.warn(err);
        }
    });
};

//TODO SAPIS and gameQueue logic if someone wants to dodge the queue before the queue call
exports[sapis.acceptQueue] = ({ socket, data, emitter, gameQueueController }) => {
    if (!data || !data.gameId) return logger.log("No data came from socket message acceptQueue.");
    async.waterfall([
        (next) => {
            gameQueueController.setPlayerVote(data.gameId, socket.id, data.answer,next);
        }
    ], (err) => {
        if (err) {
            logger.warn(err);
        }
    });
};
