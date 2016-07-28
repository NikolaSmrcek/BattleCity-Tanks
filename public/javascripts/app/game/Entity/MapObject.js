System.register(['../Config/Config'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Config_1;
    var MapObject;
    return {
        setters:[
            function (Config_1_1) {
                Config_1 = Config_1_1;
            }],
        execute: function() {
            MapObject = (function () {
                function MapObject(_tileMap, _pixiObject, entityTileSize) {
                    if (entityTileSize === void 0) { entityTileSize = null; }
                    this.entityTileSize = 0;
                    this.mapTileSize = 0;
                    this.imageScale = 0;
                    this.animations = {};
                    this.currentAnimation = null;
                    this.directions = {
                        left: false,
                        right: false,
                        up: false,
                        down: false
                    };
                    this.currentDirection = "";
                    this.x = 0;
                    this.y = 0;
                    this.dx = 0;
                    this.dy = 0;
                    //movement
                    this.movementSpeed = 0;
                    this.maxMovementSpeed = 0;
                    this.slowingSpeed = 0;
                    //For collision detecion
                    this.currentRow = 0;
                    this.currentColumn = 0;
                    this.xdest = 0;
                    this.ydest = 0;
                    this.xtemp = 0;
                    this.ytemp = 0;
                    this.cwidth = 0;
                    this.cheight = 0;
                    this.topLeft = false;
                    this.topRight = false;
                    this.bottomLeft = false;
                    this.bottomRight = false;
                    this.topTile = false;
                    this.bottomTile = false;
                    this.leftTile = false;
                    this.rightTile = false;
                    this.tileMap = {};
                    //pixiStage
                    this.stage = {};
                    this.graphics = null;
                    this.tileMap = _tileMap;
                    this.entityTileSize = entityTileSize || Config_1.Config.entityTileSize;
                    //TODO rethink where and how to put initial positioning
                    this.x = _pixiObject.x;
                    this.y = _pixiObject.y;
                    this.stage = _pixiObject.stage;
                    this.imageScale = Config_1.Config.imageScale;
                    this.mapTileSize = Config_1.Config.tileSize;
                    /*
                    this.graphics = new PIXI.Graphics();
                    this.graphics.lineStyle(1, 0xFF0000);
                    this.graphics.drawRect(37 * 8, 31 * 8, 8, 8);
                    this.stage.addChild(this.graphics);
                    */
                }
                MapObject.prototype.calculateCorners = function (_x, _y) {
                    var leftTile = parseInt(((_x - (this.cwidth / 2)) / this.mapTileSize).toString(), 10);
                    var rightTile = parseInt(((_x + (this.cwidth / 2)) / this.mapTileSize).toString(), 10);
                    var topTile = parseInt(((_y - (this.cheight / 2)) / this.mapTileSize).toString(), 10);
                    var bottomTile = parseInt(((_y + (this.cheight / 2)) / this.mapTileSize).toString(), 10);
                    if (topTile < 0 || bottomTile >= this.tileMap.getNumRows() || leftTile < 0 || rightTile >= this.tileMap.getNumCols()) {
                        this.topLeft = this.topRight = this.bottomLeft = this.bottomRight = true; //todo check
                        return;
                    }
                    for (var row = topTile; row < bottomTile; row++) {
                        this.leftTile = (this.leftTile == false) ? this.tileMap.isTileBlocking(row, leftTile) : this.leftTile;
                        this.rightTile = (this.rightTile == false) ? this.tileMap.isTileBlocking(row, rightTile) : this.rightTile;
                    }
                    for (var column = leftTile; column < rightTile; column++) {
                        this.topTile = (this.topTile == false) ? this.tileMap.isTileBlocking(topTile, column) : this.topTile;
                        this.bottomTile = (this.bottomTile == false) ? this.tileMap.isTileBlocking(bottomTile, column) : this.bottomTile;
                    }
                };
                MapObject.prototype.checkTileMapCollision = function () {
                    this.currentRow = parseInt((this.y / this.mapTileSize).toString(), 10);
                    this.currentColumn = parseInt((this.x / this.mapTileSize).toString(), 10);
                    this.xdest = this.x + this.dx;
                    this.ydest = this.y + this.dy;
                    this.xtemp = this.x;
                    this.ytemp = this.y;
                    if (this.dx == 0 && this.dy == 0)
                        return;
                    this.calculateCorners(this.x, this.ydest);
                    if (this.dy < 0) {
                        if (this.topTile) {
                            this.dy = 0;
                            //this.ytemp = this.currentRow * this.mapTileSize + this.cheight / 2;
                            this.ytemp = this.y;
                            this.topTile = false;
                        }
                        else {
                            this.ytemp += this.dy;
                        }
                    }
                    if (this.dy > 0) {
                        if (this.bottomTile) {
                            this.dy = 0;
                            //falling false - TODO remove it
                            //this.ytemp = (this.currentRow + 1) * this.mapTileSize - this.cheight / 2;
                            this.ytemp = this.y;
                            this.bottomTile = false;
                        }
                        else {
                            this.ytemp += this.dy;
                        }
                    }
                    this.calculateCorners(this.xdest, this.y);
                    if (this.dx < 0) {
                        if (this.leftTile) {
                            this.dx = 0;
                            //this.xtemp = this.currentColumn * this.mapTileSize + this.cwidth / 2;
                            this.xtemp = this.x;
                            this.leftTile = false;
                        }
                        else {
                            this.xtemp += this.dx;
                        }
                    }
                    if (this.dx > 0) {
                        if (this.rightTile) {
                            this.dx = 0;
                            //this.xtemp = (this.currentColumn + 1) * this.mapTileSize - this.cwidth / 2;
                            this.xtemp = this.x;
                            this.rightTile = false;
                        }
                        else {
                            this.xtemp += this.dx;
                        }
                    }
                };
                MapObject.prototype.setPosition = function (x, y) {
                    this.x = x;
                    this.y = y;
                    for (var key in this.animations) {
                        this.animations[key].position.set(x, y);
                    }
                };
                MapObject.prototype.getX = function () {
                    return this.x;
                };
                MapObject.prototype.getY = function () {
                    return this.y;
                };
                MapObject.prototype.getCWidth = function () {
                    return this.cwidth;
                };
                MapObject.prototype.getCHeight = function () {
                    return this.cheight;
                };
                MapObject.prototype.setDirection = function (_direction) {
                    if (!this.directions.hasOwnProperty(_direction))
                        return console.log("Wrong direction. Sent: ", _direction, " directions: ", this.directions);
                    for (var key in this.directions) {
                        if (key == _direction) {
                            this.directions[key] = true;
                            this.currentDirection = _direction;
                            this.setAnimation(_direction);
                        }
                        else {
                            this.directions[key] = false;
                        }
                    }
                };
                //TODO shoot
                MapObject.prototype.setAnimation = function (_animation) {
                    if (!this.animations.hasOwnProperty(_animation))
                        return console.log("Non exsisting animation: ", _animation);
                    if (this.currentAnimation) {
                        this.currentAnimation.stop();
                        this.currentAnimation.visible = false;
                    }
                    this.currentAnimation = this.animations[_animation];
                    this.currentAnimation.play();
                    this.currentAnimation.visible = true;
                };
                MapObject.prototype.setVector = function (dx, dy) {
                    this.dx = dx;
                    this.dy = dy;
                };
                return MapObject;
            }());
            exports_1("MapObject", MapObject);
        }
    }
});
//# sourceMappingURL=MapObject.js.map