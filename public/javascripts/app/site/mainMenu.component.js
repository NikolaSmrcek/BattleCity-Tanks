System.register(['@angular/core', '../sockets/socketController', '../game/game.component', './gameScreen/gameScore.component', '@angular/router', './keyboard/keyboardConfig.component'], function(exports_1, context_1) {
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
    var core_1, socketController_1, game_component_1, gameScore_component_1, router_1, keyboardConfig_component_1;
    var MainMenuComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (socketController_1_1) {
                socketController_1 = socketController_1_1;
            },
            function (game_component_1_1) {
                game_component_1 = game_component_1_1;
            },
            function (gameScore_component_1_1) {
                gameScore_component_1 = gameScore_component_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (keyboardConfig_component_1_1) {
                keyboardConfig_component_1 = keyboardConfig_component_1_1;
            }],
        execute: function() {
            //imported component we added as Directive so it we can shot it's content in the templateURL
            MainMenuComponent = (function () {
                function MainMenuComponent(router) {
                    this.router = router;
                    this.isValid = true;
                }
                MainMenuComponent.prototype.sendQueueRequest = function () {
                    var _this = this;
                    //TODO disable button find Game, if in queue
                    this.isValid = false;
                    console.log("Clicked play!");
                    socketController_1.SocketController.emit('enterQueue', { userName: game_component_1.GameComponent.userName });
                    socketController_1.SocketController.registerSocket('gameJoin', function (data) {
                        console.log("gameJoin data: ", data);
                        game_component_1.GameComponent.gameId = data.gameId;
                    });
                    socketController_1.SocketController.registerSocket('gameInvite', function (data) {
                        console.log("received gameInvite.");
                        socketController_1.SocketController.emit("acceptQueue", { answer: true, gameId: game_component_1.GameComponent.gameId });
                    });
                    socketController_1.SocketController.registerSocket('gameInformation', function (data) {
                        console.log("received gameInformation.");
                        game_component_1.GameComponent.mapName = data.mapName;
                        game_component_1.GameComponent.mapTiles = data.mapTiles;
                        game_component_1.GameComponent.tanks = data.tanks;
                        gameScore_component_1.GameScore.tanks = data.tanks;
                        gameScore_component_1.GameScore.mapName = data.mapName;
                        gameScore_component_1.GameScore.gameDuration = data.gameDuration;
                        gameScore_component_1.GameScore.gameWinningScore = data.gameWinningScore;
                        _this.router.navigateByUrl("/game");
                    });
                };
                MainMenuComponent = __decorate([
                    core_1.Component({
                        selector: 'battleCity-mainMenu',
                        templateUrl: 'templates/mainMenu.html',
                        directives: [keyboardConfig_component_1.KeyBoardConfigComponent]
                    }), 
                    __metadata('design:paramtypes', [router_1.Router])
                ], MainMenuComponent);
                return MainMenuComponent;
            }());
            exports_1("MainMenuComponent", MainMenuComponent);
        }
    }
});
//# sourceMappingURL=mainMenu.component.js.map