var async = require('async'),
    logger = require(`${global.nodeDirectory}/libs/logger.js`),
    lodash = require("lodash");

class gameController {

    constructor(config, _db) {
        this.games = new Array();
        //this.GameModel = require(global.nodeDirectory + '/Models/Game/gameModel.js');
        this.config = config;
        this.db = _db;
        //TODO rethink maybe this should be in database also
        this.tankColours = ["yellow", "grey", "green", "pink"]; //for now all tanks start as small
        this.getMaps((err, maps) => {
            if (err) return logger.warn("Error geting maps: ", err);
            logger.log("gameController: have maps");
            this.maps = maps;
        });
    }

    getInProgressGames(callback = () => {}) {
        return callback(null, this.games);
    }

    //TODO this should be async
    findGameById(gameId, callback = () => {}) {
        if (!gameId) return callback("GameId not provided.");
        async.waterfall([
            (next) => {
                this.getInProgressGames(next);
            },
            (games, next) => {
                let index = lodash.findIndex(games, (game) => {
                    return game.id.toString() == gameId.toString();
                });
                return callback(null, games[index]);
            }
        ], (err) => {
            callback(err);
        });
    }

    //TODO set status ingame for all users
    addGame(game = null, callback = () => {}) {
        if (!game) return callback("Game cannot be null object.");
        async.waterfall([
            next => {
                game.setStatus("inprogress", next);
            },
            next => {
                this._generateGame(game, next);
            }
        ], err => {
            if (err) return callback(err);
            this.games.push(game);
            callback(null);
        });
    }

    //TODO get game by id

    removeGame(gameId = null, callback = () => {}) {
        if (!gameId) return callback("Game cannot be null or not having id.");
        lodash.remove(this.games, (userFromArray) => {
            return game.id == gameId;
        });
        return callback(null);
    }

    getMaps(callback = () => {}) {
        async.waterfall([
            next => {
                this.db.collection(this.config.mongoMapsCollectionName, next);
            },
            (collection, next) => {
                collection.find().toArray(next);
            },
            (maps, next) => {
                return callback(null, maps);
            }
        ], err => {
            if (err) return callback(err);
        });
    }

    _generateGame(game, callback) {
        let map,
            spawns,
            tankColours,
            tanks = new Array();
        async.waterfall([
            next => {
                //Choosing map randomly and cloning spawns so we can filter them out easly
                map = this.maps[Math.floor((Math.random() * this.maps.length) + 0)];
                spawns = lodash.cloneDeep(map.tankSpawns);
                tankColours = lodash.cloneDeep(this.tankColours);
                game.setMap(map, next);
            },
            next => {
                game.getMembers(next);
            },
            (members, next) => {
                //tankColour: "grey", tankType: "small", tankOwner: "RANDOM2", x: 100, y: 100, direction: "left" 
                for (let index in members) {
                    let member = members[index],
                        object = {};
                    object.tankOwner = member.userName; //TODO async call
                    let spawnIndex = Math.floor((Math.random() * spawns.length) + 0);
                    object.x = spawns[spawnIndex].x;
                    object.y = spawns[spawnIndex].y;
                    object.direction = spawns[spawnIndex].direction;
                    spawns.splice(spawnIndex, 1);
                    object.tankType = "small"; //TODO rethink shall it be all the time hardcoded small

                    object.score = 0;
                    object.bulletsFired = 0;
                    object.directionsChanged = 0;

                    let tankColoursIndex = Math.floor((Math.random() * tankColours.length) + 0);
                    object.tankColour = tankColours[tankColoursIndex];
                    tankColours.splice(tankColoursIndex, 1);

                    tanks.push(object);
                }
                game.setTanks(tanks, next);
            }
        ], err => {
            if (err) return callback(err);
            game.emitToChannel("gameInformation", { mapName: map.mapName, mapTiles: map.mapTiles, tanks: tanks });
            return callback(null);
        });
    }

}

module.exports = gameController;
