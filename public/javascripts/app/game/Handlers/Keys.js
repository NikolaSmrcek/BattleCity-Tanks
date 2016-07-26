System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Keys;
    return {
        setters:[],
        execute: function() {
            Keys = (function () {
                function Keys() {
                }
                Keys.keyboard = function (keyCode) {
                    var key = {
                        code: null,
                        isDown: null,
                        isUp: null,
                        press: undefined,
                        release: undefined,
                        downHandler: undefined,
                        upHandler: undefined
                    };
                    key.code = keyCode;
                    key.isDown = false;
                    key.isUp = true;
                    key.downHandler = function (event) {
                        if (event.keyCode === key.code) {
                            if (key.isUp && key.press)
                                key.press();
                            key.isDown = true;
                            key.isUp = false;
                        }
                        event.preventDefault();
                    };
                    key.upHandler = function (event) {
                        if (event.keyCode === key.code) {
                            if (key.isDown && key.release)
                                key.release();
                            key.isDown = false;
                            key.isUp = true;
                        }
                        event.preventDefault();
                    };
                    window.addEventListener("keydown", key.downHandler.bind(key), false);
                    window.addEventListener("keyup", key.upHandler.bind(key), false);
                    this.keys[keyCode] = key;
                    return key;
                };
                Keys.keys = {};
                return Keys;
            }());
            exports_1("Keys", Keys);
        }
    }
});
//# sourceMappingURL=Keys.js.map