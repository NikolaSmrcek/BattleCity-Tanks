System.register(['./MapObject', '../Config/Config', '../Handlers/Keys'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var MapObject_1, Config_1, Keys_1;
    var Tank;
    return {
        setters:[
            function (MapObject_1_1) {
                MapObject_1 = MapObject_1_1;
            },
            function (Config_1_1) {
                Config_1 = Config_1_1;
            },
            function (Keys_1_1) {
                Keys_1 = Keys_1_1;
            }],
        execute: function() {
            Tank = (function (_super) {
                __extends(Tank, _super);
                //pixiObject must have a texture, tankColour, tankType, tankOwner and isMyTank and SpriteUtilites as u
                //pixiObject has initial x and y coordinates, stage od the pixi gameAlso
                function Tank(_tileMap, pixiObject, _direction) {
                    _super.call(this, _tileMap, pixiObject);
                    this.tankOwner = "";
                    this.tankColour = "";
                    this.tankType = "";
                    this.isMyTank = false;
                    this.tankOwner = pixiObject.tankOwner || "";
                    this.tankColour = pixiObject.tankColour;
                    this.tankType = pixiObject.tankType;
                    this.isMyTank = pixiObject.isMyTank || false;
                    this.cwidth = Config_1.Config.entityTileSize * Config_1.Config.imageScale; //TODO check if * imageScale is neccesary
                    this.cheight = Config_1.Config.entityTileSize * Config_1.Config.imageScale;
                    //TODO TEST
                    this.movementSpeed = 2;
                    this.maxMovementSpeed = 2;
                    this.slowingSpeed = 1;
                    this.setupTank(pixiObject);
                    this.setDirection(_direction);
                }
                //smoothing the movement
                Tank.prototype.getNextPosition = function () {
                    //TODO check if it works
                    if (this.isMyTank && !Keys_1.Keys.isSomeKeyPressed) {
                        this.dx = 0;
                        this.dy = 0;
                        return;
                    }
                    var maxSpeed = this.maxMovementSpeed;
                    if (this.directions["left"]) {
                        this.dx -= this.movementSpeed;
                        if (this.dx < -maxSpeed) {
                            this.dx = -maxSpeed;
                        }
                    }
                    else if (this.directions["right"]) {
                        this.dx += this.movementSpeed;
                        if (this.dx > maxSpeed) {
                            this.dx = maxSpeed;
                        }
                    }
                    else {
                        if (this.dx > 0) {
                            this.dx -= this.slowingSpeed;
                            if (this.dx < 0) {
                                this.dx = 0;
                            }
                        }
                        else if (this.dx < 0) {
                            this.dx += this.slowingSpeed;
                            if (this.dx > 0) {
                                this.dx = 0;
                            }
                        }
                    }
                    if (this.directions["up"]) {
                        this.dy -= this.movementSpeed;
                        if (this.dy < -maxSpeed) {
                            this.dy = -maxSpeed;
                        }
                    }
                    else if (this.directions["down"]) {
                        this.dy += this.movementSpeed;
                        if (this.dy > maxSpeed) {
                            this.dy = maxSpeed;
                        }
                    }
                    else {
                        if (this.dy > 0) {
                            this.dy -= this.slowingSpeed;
                            if (this.dy < 0) {
                                this.dy = 0;
                            }
                        }
                        else if (this.dy < 0) {
                            this.dy += this.slowingSpeed;
                            if (this.dy > 0) {
                                this.dy = 0;
                            }
                        }
                    }
                }; //end of the function getNextPosition
                Tank.prototype.setupTank = function (_pixiObject) {
                    var tankFrameCoordinates = Config_1.Config.tankAnimations[_pixiObject.tankColour][_pixiObject.tankType], u = _pixiObject.u, texture = _pixiObject.texture;
                    for (var key in tankFrameCoordinates) {
                        var textures = u.frames(texture, tankFrameCoordinates[key], this.entityTileSize, this.entityTileSize);
                        this.animations[key] = new PIXI.extras.MovieClip(textures);
                        this.animations[key].anchor.set(0.5); //TODO change this to configuration
                        this.animations[key].animationSpeed = 0.5; //TODO change this to configuration
                        this.animations[key].visible = false;
                        this.animations[key].position.set(this.x, this.y);
                        this.animations[key].scale.set(this.imageScale);
                        this.stage.addChild(this.animations[key]);
                    }
                };
                Tank.prototype.animate = function () {
                    this.getNextPosition();
                    this.checkTileMapCollision();
                    this.setPosition(this.xtemp, this.ytemp);
                };
                return Tank;
            }(MapObject_1.MapObject));
            exports_1("Tank", Tank);
        }
    }
});
//# sourceMappingURL=Tank.js.map