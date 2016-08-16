System.register(['@angular/core', '../../game/Handlers/Keys', '../../game/game.component', '../../sockets/socketController'], function(exports_1, context_1) {
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
    var core_1, Keys_1, game_component_1, socketController_1;
    var GameChat;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Keys_1_1) {
                Keys_1 = Keys_1_1;
            },
            function (game_component_1_1) {
                game_component_1 = game_component_1_1;
            },
            function (socketController_1_1) {
                socketController_1 = socketController_1_1;
            }],
        execute: function() {
            //TODO import SocketController - emit messages and display messages
            GameChat = (function () {
                function GameChat() {
                    this.conversation = [];
                    this.conversation = [];
                }
                GameChat.prototype.ngOnInit = function () {
                    var _this = this;
                    this.conversation = [];
                    socketController_1.SocketController.registerSocket("gameChatMessage", function (data) {
                        _this.conversation.push({ "message": data.message, "color": data.color });
                    });
                };
                GameChat.prototype.send = function () {
                    //this.conversation.push({ "message": this.message, "color": "red" });
                    socketController_1.SocketController.emit("gameChatMessage", { message: this.message, color: game_component_1.GameComponent.myTankColour, gameId: game_component_1.GameComponent.gameId, tankOwner: game_component_1.GameComponent.userName });
                    this.message = "";
                };
                GameChat.prototype.keypressHandler = function (event) {
                    if (event.keyCode === 13) {
                        this.send();
                    }
                };
                GameChat.prototype.changeKeysInGameFocus = function () {
                    Keys_1.Keys.isInGame = false;
                };
                GameChat.prototype.changeKeysInGameBlur = function () {
                    Keys_1.Keys.isInGame = true;
                };
                GameChat = __decorate([
                    core_1.Component({
                        selector: 'battleCity-gameChat',
                        templateUrl: 'templates/gameScreen/gameChat.html',
                        styleUrls: ['public/stylesheets/gameScreen/gameChat.component.css'] //looking from the nodejs point of view
                    }), 
                    __metadata('design:paramtypes', [])
                ], GameChat);
                return GameChat;
            }());
            exports_1("GameChat", GameChat);
        }
    }
});
//# sourceMappingURL=gameChat.component.js.map