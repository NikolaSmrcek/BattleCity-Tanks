var sapis = require(global.nodeDirectory + '/Models/Sockets/meta/sapis.js'),
    logger = require(`${global.nodeDirectory}/libs/logger.js`),
    async = require('async');


exports[sapis.gameTankAction] = ({ socket, data, emitter, gameController }) => {
    if (!data || !data.gameId) return logger.log("No data came from socket message gameTankAction.");
    let game = null;
    async.waterfall([
        (next) => {
            gameController.findGameById(data.gameId, next);
        },
        (_game, next) => {
            //TODO some logic
            if (!_game || _game.gameOver) return next("Game does not exist with provided id or game has finished.");
            game = _game;
            game.incrementTankActions(data.tankOwner, data.action, next);
        },
        next => {
            game.emitToChannel(sapis.gameTankAction, data);
            next(null);
        }
    ], (err) => {
        if (err) {
            logger.warn(err);
        }
    });
};

exports[sapis.gameChatMessage] = ({ socket, data, emitter, gameController }) => {
    if (!data || !data.gameId) return logger.log("No data came from socket message gameChatMessage.");
    let game = null;
    async.waterfall([
        (next) => {
            gameController.findGameById(data.gameId, next);
        },
        (_game, next) => {
            //TODO some logic
            if (!_game || _game.gameOver) return next("Game does not exist with provided id or game has finished.");
            game = _game;
            game.saveNewGameMessage(data, next);
        },
        next => {
            game.emitToChannel(sapis.gameChatMessage, data);
            next(null);
        }
    ], (err) => {
        if (err) {
            logger.warn(err);
        }
    });
};

//increaseScore
exports[sapis.gameTankHit] = ({ socket, data, emitter, gameController }) => {
    if (!data || !data.gameId) return logger.log("No data came from socket message gameTankHit.");
    let game = null;
    async.waterfall([
        (next) => {
            gameController.findGameById(data.gameId, next);
        },
        (_game, next) => {
            //TODO some logic + emit score
            if (!_game || _game.gameOver) return next("Game does not exist with provided id or game has finished.");
            game = _game;
            game.incrementTankScore(data.tankOwner, next);
        },
        (tanks, next) => {
            game.emitToChannel("gameScore", tanks);
            next(null);
        }
    ], (err) => {
        if (err) {
            logger.warn(err);
        }
    });
};
