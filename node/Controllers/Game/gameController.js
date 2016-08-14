var async = require('async'),
    logger = require(`${global.nodeDirectory}/libs/logger.js`),
    lodash = require("lodash");

class gameController {

    constructor(config) {
        this.games = new Array();
        //this.GameModel = require(global.nodeDirectory + '/Models/Game/gameModel.js');
        this.config = config;
    }

    getInProgressGames(callback = () => {}) {
        return callback(null, this.games);
    }

    //TODO emit users that game is starting, send them notification, choose map tanks for members
    addGame(game = null, callback = () => {}) {
        if (!game) return callback("Game cannot be null object.");
        game.setStatus("inprogress", () => {
            this.games.push(game);
            callback(null);
        });
    }

    removeGame(gameId = null, callback = () => {}) {
        if (!gameId) return callback("Game cannot be null or not having id.");
        lodash.remove(this.games, (userFromArray) => {
            return game.id == gameId;
        });
        return callback(null);
    }

    
   

}

module.exports = gameController;
