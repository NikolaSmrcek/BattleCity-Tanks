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
                Keys.keyboard = function (_key) {
                    var _this = this;
                    var key = {
                        code: parseInt(_key.keyCode, 10),
                        name: _key.action,
                        moveAndAction: _key.moveAndAction,
                        isDown: false,
                        isUp: true,
                        press: undefined,
                        release: undefined,
                        downHandler: undefined,
                        upHandler: undefined
                    };
                    //&& ((!this.currentKeyPressed || this.currentKeyPressed.code === key.code) || key.moveAndAction)
                    key.downHandler = function (event) {
                        if (_this.isInGame && event.keyCode === key.code && ((!_this.currentKeyPressed || _this.currentKeyPressed.code === key.code) || key.moveAndAction)) {
                            if (key.isUp && key.press)
                                key.press();
                            key.isDown = true;
                            key.isUp = false;
                            if (_this.currentKeyPressed) {
                                _this.previousKeyPressed = _this.currentKeyPressed;
                            }
                            _this.currentKeyPressed = key;
                            _this.isSomeKeyPressed = true;
                            event.preventDefault();
                        }
                    };
                    //&& ((this.currentKeyPressed.code === key.code) || key.moveAndAction )
                    key.upHandler = function (event) {
                        if (_this.isInGame && event.keyCode === key.code && ((_this.currentKeyPressed && _this.currentKeyPressed.code === key.code) || key.moveAndAction)) {
                            //TODO test it maybe it needs some smoothing, example enable shooting and moving
                            if (key.isDown && key.release)
                                key.release();
                            key.isDown = false;
                            key.isUp = true;
                            _this.currentKeyPressed = null;
                            _this.isSomeKeyPressed = false;
                            event.preventDefault();
                        }
                    };
                    window.addEventListener("keydown", key.downHandler.bind(key), false);
                    window.addEventListener("keyup", key.upHandler.bind(key), false);
                    this.keys[key.code] = key;
                    //return key;
                };
                Keys.checkTwoKeys = function (previous, current) {
                    if (!previous || !current)
                        return;
                    return ((Keys.previousKeyPressed && Keys.previousKeyPressed.name == previous) && (Keys.currentKeyPressed && Keys.currentKeyPressed.name == current));
                };
                Keys.checkKeyPress = function (key) {
                    if (!key)
                        return;
                    return (Keys.currentKeyPressed && Keys.currentKeyPressed.name == key);
                };
                Keys.keys = {};
                Keys.isSomeKeyPressed = false;
                Keys.currentKeyPressed = null;
                Keys.previousKeyPressed = null;
                Keys.isInGame = false;
                return Keys;
            }());
            exports_1("Keys", Keys);
        }
    }
});
//# sourceMappingURL=Keys.js.map