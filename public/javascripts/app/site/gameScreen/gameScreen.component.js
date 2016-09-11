System.register(['@angular/core', '../../game/game.component', './gameChat.component', './gameScore.component', '../../sockets/socketController', '@angular/router'], function(exports_1, context_1) {
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
    var core_1, game_component_1, gameChat_component_1, gameScore_component_1, socketController_1, router_1;
    var GameScreen;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (game_component_1_1) {
                game_component_1 = game_component_1_1;
            },
            function (gameChat_component_1_1) {
                gameChat_component_1 = gameChat_component_1_1;
            },
            function (gameScore_component_1_1) {
                gameScore_component_1 = gameScore_component_1_1;
            },
            function (socketController_1_1) {
                socketController_1 = socketController_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            GameScreen = (function () {
                function GameScreen(router) {
                    this.router = router;
                    this.alerted = false;
                    this.alerted = false;
                    this.registerSockets();
                }
                GameScreen.prototype.registerSockets = function () {
                    var _this = this;
                    socketController_1.SocketController.registerSocket("gameOver", function (data) {
                        game_component_1.GameComponent.gameOver = true;
                        socketController_1.SocketController.emit("setStatus", { status: "online" });
                        if (!_this.alerted) {
                            _this.alerted = true;
                            alert("GAME OVER! Thanks for play BattleCiry Tanks alpha. After this you will be routed to the mainMenu!");
                            _this.router.navigateByUrl("");
                        }
                    });
                };
                GameScreen = __decorate([
                    core_1.Component({
                        selector: 'battleCity-gameScreen',
                        templateUrl: 'templates/gameScreen/gameScreen.html',
                        directives: [game_component_1.GameComponent, gameChat_component_1.GameChat, gameScore_component_1.GameScore]
                    }), 
                    __metadata('design:paramtypes', [router_1.Router])
                ], GameScreen);
                return GameScreen;
            }());
            exports_1("GameScreen", GameScreen);
        }
    }
});
//# sourceMappingURL=gameScreen.component.js.map