System.register(['@angular/core', '../../game/game.component', '../../sockets/socketController'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, game_component_1, socketController_1;
    var GameScore;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (game_component_1_1) {
                game_component_1 = game_component_1_1;
            },
            function (socketController_1_1) {
                socketController_1 = socketController_1_1;
            }],
        execute: function() {
            GameScore = (function () {
                function GameScore() {
                    this.myTank = {};
                    this.enemyTanks = [];
                    this.userName = "";
                    this.rulesColor = "white";
                    this._gameWinningScore = 0;
                    this._gameDuration = 0;
                    this.enemyTanks = new Array();
                    this.userName = game_component_1.GameComponent.userName;
                    this.registerTanks(GameScore.tanks);
                    this.registerSockets();
                    this._gameInterval();
                    this._gameWinningScore = GameScore.gameWinningScore;
                    this._gameDuration = GameScore.gameDuration;
                }
                GameScore.prototype.registerTanks = function (tanks) {
                    for (var i = 0; i < tanks.length; i++) {
                        tanks[i].score = 0;
                        if (tanks[i].tankOwner === this.userName) {
                            this.myTank = tanks[i];
                        }
                        else {
                            this.enemyTanks.push(tanks[i]);
                        }
                    }
                };
                GameScore.prototype.registerSockets = function () {
                    var _this = this;
                    socketController_1.SocketController.registerSocket('gameScore', function (data) {
                        console.log("received gameScore.");
                        //console.log(data);
                        for (var index in data) {
                            var currentTank = data[index];
                            var tank = _this._getTank(currentTank.tankOwner);
                            tank.score = currentTank.score;
                        }
                        //TODO score
                    });
                };
                GameScore.prototype._getTank = function (tankOwner) {
                    var tank = null;
                    if (tankOwner === this.userName) {
                        tank = this.myTank;
                    }
                    else {
                        for (var j = 0; j < this.enemyTanks.length; j++) {
                            if (this.enemyTanks[j].tankOwner === tankOwner) {
                                tank = this.enemyTanks[j];
                            }
                        }
                    }
                    return tank;
                };
                GameScore.prototype._gameInterval = function () {
                    var _this = this;
                    setInterval(function () {
                        if (_this._gameDuration > 0 && !game_component_1.GameComponent.gameOver) {
                            _this._gameDuration -= 1;
                        }
                    }, 1000);
                };
                GameScore.tanks = {};
                GameScore.mapName = "";
                GameScore.gameWinningScore = 0;
                GameScore.gameDuration = 0;
                GameScore = __decorate([
                    core_1.Component({
                        selector: 'battleCity-gameScore',
                        templateUrl: 'templates/gameScreen/gameScore.html',
                        styleUrls: ['public/stylesheets/gameScreen/gameScore.component.css'] //looking from the nodejs point of view
                    }), 
                    __metadata('design:paramtypes', [])
                ], GameScore);
                return GameScore;
            }());
            exports_1("GameScore", GameScore);
        }
    }
});
//# sourceMappingURL=gameScore.component.js.map