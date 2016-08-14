System.register(['@angular/core', '@angular/router', '../sockets/socketController', '../game/game.component'], function(exports_1, context_1) {
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
    var core_1, router_1, socketController_1, game_component_1;
    var IndexComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (socketController_1_1) {
                socketController_1 = socketController_1_1;
            },
            function (game_component_1_1) {
                game_component_1 = game_component_1_1;
            }],
        execute: function() {
            IndexComponent = (function () {
                function IndexComponent() {
                    this.getUserName();
                }
                IndexComponent.prototype.getUserName = function () {
                    socketController_1.SocketController.emit('userName', { msg: "msg" });
                    socketController_1.SocketController.registerSocket('userName', function (data) {
                        //console.log("userName: ", data);
                        if (data.status = 200)
                            game_component_1.GameComponent.userName = data.userName;
                    });
                };
                IndexComponent = __decorate([
                    core_1.Component({
                        selector: 'battleCity',
                        template: '<router-outlet></router-outlet>',
                        directives: [router_1.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], IndexComponent);
                return IndexComponent;
            }());
            exports_1("IndexComponent", IndexComponent);
        }
    }
});
//# sourceMappingURL=index.component.js.map