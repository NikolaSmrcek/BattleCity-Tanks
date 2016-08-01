var sapis = require(global.nodeDirectory + '/Models/Sockets/meta/sapis.js'),
    logger = require(`${global.nodeDirectory}/libs/logger.js`),
    async = require('async');


//User joined queue
exports[sapis.enterQueue] = ({ socket, data, emitter, queueController, usersController }) => {
    async.waterfall([
        (next) => {
            usersController.canJoinQueue(socket.id, next);
        },
        (next, canJoinQueue) => {
            if (canJoinQueue) {
                queueController.addMember(usersController.getUserBySocketId(socket.id, next));
            } else {
                next("User can't join queue, dodged too many games.");
            }
        }
    ], (err) => {
        if (err) {
            logger.warn(err);
        }
    });
};
