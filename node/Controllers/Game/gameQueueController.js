var async = require('async'),
    logger = require(`${global.nodeDirectory}/libs/logger.js`),
    lodash = require("lodash"),
    moment = require('moment');

var GameModel = require(global.nodeDirectory + '/Models/Game/gameModel.js');

class gameQueueController {

    constructor(queueModel = null, gameController, config, _emitter) {
        if (!queueModel) return logger.error("QueueModel is null cannot initilize queueController.");
        this.queueModel = queueModel;

        this.gameController = gameController;

        this.queueGames = new Array();

        this.interval = null;
        this.config = config;

        this.emitter = _emitter;

        this.startQueue();
    }

    addMember(member, callback = () => {}) {
        this.queueModel.addUser(member, callback);
    }

    removeMember(member, callback = () => {}) {
        this.queueModel.removeUser(member, callback);
    }

    getQueueGames(callback = () => {}) {
        return callback(null, this.queueGames);
    }

    checkQueue(callback = () => {}) {
        async.waterfall([
            (next) => {
                //logger.log("Getting queue games.");
                this.getQueueGames(next);
            },
            (games, next) => {
                //logger.log("Checking if the game can be played.");
                this._checkGameQueueTime(games, next);
            },
            (next) => {
                //logger.log("Getting queue players.");
                this.queueModel.getQueue(next);
            },
            (_members, next) => {
                if (!_members || _members.length < 1) return next("Queue members array is empty.");
                //if there is members try to make a game
                //logger.log("Assinging members to game or creating new game.");
                this._assignMember(_members, next);
            }
        ], (err) => {
            if (err) {
                //logger.error(err);
            } else {
                logger.log("everything went fine");
            }
        });
    }

    _assignMember(members, callback = () => {}) {
        //TODO somehow emit a player message to join game
        logger.log("Assign members called.");
        async.eachSeries(members, (member, innerCallback) => {
            async.waterfall([
                //get all queueGame
                (next) => {
                    this.getQueueGames(next);
                },
                //first we try to add member to anohter game that has free spot
                (games, next) => {
                    async.eachSeries(games, (game, innCallback) => {
                        async.waterfall([
                            (_next) => {
                                //get current game number of players
                                game.getMembersLength(_next);
                            },
                            //if there is room add member and RETURN FROM EACHSERIES of games - member added don't search for games anymore
                            (length, _next) => {
                                if (length < this.config.maxGameMembers) {
                                    game.addMember(member, (err) => {
                                        return next(err, true);
                                    });
                                } else {
                                    _next(null);
                                }
                            }
                        ], (err) => {
                            innCallback(err);
                        });

                    }, (err) => {
                        next(err, false);
                    });
                },
                //if the user has been added then skip this step, if it has not, that means we have to create game since there is no room in any of the games
                (added, next) => {
                    if (added) {
                        next(null, added);
                    } else {
                        this._createQueueGame(member, next);
                    }
                },
                //remove the user if he has been added to game or created new game with him
                (added, next) => {
                    if (added) {
                        this.removeMember(member, next);
                    } else {
                        //should never get this error
                        next("Could not add member to game or create new game with that member for unknown reason.");
                    }
                }
            ], (err) => {
                innerCallback(err);
            })
        }, (err) => {
            if (err) {
                return callback("Error while assigning member to queue.")
            }
            else{
                return callback(null);
            }
        });
    };
    //method for creating new game object
    _createQueueGame(member = null, callback = () => {}) {
        if (!member) return callback("Can create game with null object member.");
        let game = null;
        async.waterfall([
            (next) => {
                game = new GameModel(this.config, this.emitter);
                game.setStatus("inqueue", next);
            },
            (next) => {
                game.addMember(member, next);
            },
            (next) => {
                this._addGameToQueueGameList(game, next);
            }
        ], (err) => {
            if (err) {
                callback(err);
            } else {
                callback(err, true)
            }
        })
    };
    //method for swithcing game from inqueue to inprogress
    _checkGameQueueTime(games, callback = () => {}) {
        //TODO cehck if it works - gameStarts TODO emit socket for each member that game starts
        async.eachSeries(games, (game, innerCallback) => {
            async.waterfall([
                (next) => {
                    game._checkQueueWaitingTime(next);
                },
                (playable, next) => {
                    if (playable) {
                        //TODO timeut to get all votes - 
                        //this._switchGames(game, next);
                        this._inviteToGame(game, next);
                    } else {
                        next(null);
                    }
                }
            ], (err) => {
                innerCallback(err);
            });

        }, (err) => {
            if (err) {
                return callback("Error while assigning member to queue.")
            }
            return callback(null);
        });
    };
    //adding to gameController, removing from the queueController.
    _switchGames(game = null, callback = () => {}) {
            if (!game) return callback("No game object");
            this.gameController.addGame(game, (err) => {
                if (err) return callback(err);
                //TODO if necessary async get queueGames
                lodash.remove(this.queueGames, (queueGame) => {
                    return queueGame.id == game.id;
                });
                logger.log("Game switch success.");
                //TODO emit everyone that game is now in progress - success
                //TODO set everymember status "ingame"
                return callback(null);
            });

        }
        //adding new created game to the queueGame list (means we are searching for new members for the game)
    _addGameToQueueGameList(game = null, callback = () => {}) {
        if (!game) return callback("No game object");
        this.queueGames.push(game);
        return callback(null);
    };

    _inviteToGame(game = null, callback = () => {}) {
        if (!game) return callback("Game object cannot be null");
        async.waterfall([
            (next) => {
                game.emitToChannel("gameInvite", {});
                game.setStatus("invitational", next);
            },
            (next) => {
                //TODO - emit Are you ready - to each player of the game
                this._checkPlayerInvitationalResponse(game, next);
            }
        ], (err) => {
            return callback(err);
        });
    }

    _checkPlayerInvitationalResponse(game = null, callback = () => {}) {
        if (!game) return callback("Game object cannot be null");
        logger.log("_checkPlayerInvitationalResponse");
        setTimeout(() => {
            let votes = null,
                members = null,
                membersToRemove = new Array(),
                ready = true;
            async.waterfall([
                (next) => {
                    game.getInviteVotes(next);
                },
                (_votes, next) => {
                    votes = _votes;
                    game.getMembers(next);
                },
                (_members, next) => {
                    members = _members;
                    for (let index in members) {
                        let member = members[index];
                        if (votes == {} || !votes[member.socketId]) {
                            if(member.socketId in votes) console.log("It is inside.");
                            ready = false;
                            membersToRemove.push(member);
                        }
                    }
                    next(null);
                },
                (next) => {
                    //if there is someone in members to remove we should put game back to queue - notify players about the actions
                    if (!ready) {
                        logger.log("_checkPlayerInvitationalResponse before remov: ", game.gameMembers.length);
                        async.eachSeries(membersToRemove, (member, innCallback) => {
                            //TODO emit messages that they left queue
                            async.waterfall([
                                (_next) => {
                                    game.removeMember(member, _next);
                                },
                                (_next) => {
                                    member.incrementQueueDodges(_next);
                                }
                            ], (err) => {
                                innCallback(err);
                            })

                        }, (err) => {
                            if (err) return next(err);
                            //TODO set these two parameters async - if we are ever going to memCache
                            game.inviteVotes = {};
                            game.lastAddedMember = moment().unix();;
                            game.setStatus("inqueue", next);
                        });
                        logger.log("_checkPlayerInvitationalResponse after remov: ", game.gameMembers.length);
                    }
                    //everyone is ready we pass the game to the GameController and remove it from the Queue
                    else {
                        this._switchGames(game, next);
                    }
                }
            ], (err) => {
                if (err) return callback(err);
            });
        }, this.config.queueInviteWaitingTime);
    }

    //todo find game object
    setPlayerVote(gameId, socketId, answer, callback = () => {}) {
        async.waterfall([
            (next) => {
                this.findGameById(gameId, next);
            },
            (game, next) => {
                if (!game) return next("Could not find game with provided id.");
                game.setMemberQueueVote(socketId, answer, next);
            }
        ], (err) => {
            callback(err);
        });
    };

    findGameById(gameId, callback = () => {}) {
        if (!gameId) return callback("GameId not provided.");
        async.waterfall([
            (next) => {
                this.getQueueGames(next);
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

    //TODO make method to get all players from a specific game and notfiy all of them by their socketId channel what happend

    startQueue(callback = () => {}) {
        this.interval = setInterval(this.checkQueue.bind(this), this.config.queueInterval);
        callback();
    }

    stopQueue(callback = () => {}) {
            clearInterval(this.interval);
            callback();
        }
        //TODO cron job + search for members and notify them if found match

}

module.exports = gameQueueController;
