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
                    var _this = this;
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
                        if (event.keyCode === key.code && (!_this.currentKeyPressed || _this.currentKeyPressed.code === key.code)) {
                            if (key.isUp && key.press)
                                key.press();
                            key.isDown = true;
                            key.isUp = false;
                            _this.currentKeyPressed = key;
                            _this.isSomeKeyPressed = true;
                        }
                        event.preventDefault();
                    };
                    key.upHandler = function (event) {
                        if (event.keyCode === key.code && ((_this.currentKeyPressed.code === key.code))) {
                            //TODO test it maybe it needs some smoothing, example enable shooting and moving
                            if (key.isDown && key.release)
                                key.release();
                            key.isDown = false;
                            key.isUp = true;
                            _this.currentKeyPressed = null;
                            _this.isSomeKeyPressed = false;
                        }
                        event.preventDefault();
                    };
                    window.addEventListener("keydown", key.downHandler.bind(key), false);
                    window.addEventListener("keyup", key.upHandler.bind(key), false);
                    this.keys[keyCode] = key;
                    //return key;
                };
                Keys.keys = {};
                Keys.isSomeKeyPressed = false;
                Keys.currentKeyPressed = null;
                return Keys;
            }());
            exports_1("Keys", Keys);
        }
    }
});
//# sourceMappingURL=Keys.js.map