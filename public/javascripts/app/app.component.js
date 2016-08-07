System.register(['@angular/core', './sockets/socketController'], function(exports_1, context_1) {
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
    var core_1, socketController_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (socketController_1_1) {
                socketController_1 = socketController_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    var _this = this;
                    this.price = 0.0;
                    this.bidValue = '';
                    socketController_1.SocketController.registerSocket('priceUpdate', function (data) { _this.price = data; });
                    //TODO remove below lines, only for testing
                    socketController_1.SocketController.emit('userName', { userName: "kanta2323" + Math.floor((Math.random() * 100) + 1) });
                    setTimeout(function () {
                        socketController_1.SocketController.emit('enterQueue', { userName: "kanta2323" });
                    }, 100);
                    setInterval(function () {
                        console.log("TRying to enter queue");
                        socketController_1.SocketController.emit('enterQueue', { userName: "kanta2323" });
                    }, 1000 * 10);
                }
                AppComponent.prototype.bid = function () {
                    socketController_1.SocketController.emit('bid', this.bidValue);
                    this.bidValue = '';
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'auction-app',
                        templateUrl: 'templates/product.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map