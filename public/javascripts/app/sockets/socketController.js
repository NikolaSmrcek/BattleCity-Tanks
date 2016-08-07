System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SocketController;
    return {
        setters:[],
        execute: function() {
            //declare var mySocket: any;
            SocketController = (function () {
                function SocketController() {
                }
                SocketController.registerSocket = function (listener, callback) {
                    SocketController.checkSocketInit();
                    SocketController.socket.on(listener, callback);
                };
                SocketController.emit = function (destination, data) {
                    SocketController.checkSocketInit();
                    SocketController.socket.emit(destination, data);
                };
                SocketController.checkSocketInit = function () {
                    if (SocketController.socket)
                        return;
                    SocketController.socket = io('http://localhost:8000');
                };
                return SocketController;
            }());
            exports_1("SocketController", SocketController);
        }
    }
});
//# sourceMappingURL=socketController.js.map