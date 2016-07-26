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
                function MapObject(_tileMap, _direction, entityTileSize) {
                    if (entityTileSize === void 0) { entityTileSize = null; }
                    this.entityTileSize = 0;
                    this.mapTileSize = 0;
                    this.imageScale = 0;
                    this.animations = {};
                    this.currentAnimation = {};
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
                    this.insideTile = false;
                    this.tileMap = {};
                    this.tileMap = _tileMap;
                    this.entityTileSize = entityTileSize || Config_1.Config.entityTileSize;
                    this.imageScale = Config_1.Config.imageScale;
                    this.mapTileSize = Config_1.Config.tileSize;
                    //TODO change other directions to false, set new facing to true
                    this.setDirection(_direction);
                }
                MapObject.prototype.calculateCorners = function (x, y) {
                    var leftTile = Math.round((this.x - (this.cwidth / 2)) / this.mapTileSize);
                    var rightTile = Math.round((this.x + (this.cwidth / 2) - 1) / this.mapTileSize);
                    var topTile = Math.round((this.y - (this.cheight / 2)) / this.mapTileSize);
                    var bottomTile = Math.round((this.y - (this.cheight / 2) - 1) / this.mapTileSize);
                    if (topTile < 0 || bottomTile >= this.tileMap.getNumRows() || leftTile < 0 || rightTile >= this.tileMap.getNumCols()) {
                        this.topLeft = this.topRight = this.bottomLeft = this.bottomRight = this.insideTile = false;
                        return;
                    }
                    this.topLeft = this.tileMap.isTileBlocking(topTile, leftTile);
                    this.topRight = this.tileMap.isTileBlocking(topTile, rightTile);
                    this.bottomLeft = this.tileMap.isTileBlocking(bottomTile, leftTile);
                    this.bottomRight = this.tileMap.isTileBlocking(bottomTile, rightTile);
                    this.insideTile = this.tileMap.isTileBlocking(this.currentRow, this.currentColumn);
                };
                MapObject.prototype.checkTileMapCollision = function () {
                    this.currentRow = Math.round(this.y / this.mapTileSize);
                    this.currentColumn = Math.round(this.x / this.mapTileSize);
                    this.xdest = this.x + this.dx;
                    this.ydest = this.y + this.dy;
                    this.xtemp = this.x;
                    this.ytemp = this.y;
                    this.calculateCorners(this.x, this.ydest);
                    if (this.dy < 0) {
                        if (this.topLeft || this.topRight) {
                            this.dy = 0;
                            this.ytemp = this.currentRow * this.mapTileSize + this.cwidth / 2;
                        }
                        else {
                            this.ytemp += this.dy;
                        }
                    }
                    if (this.dy > 0) {
                        if (this.bottomLeft || this.bottomRight) {
                            this.dy = 0;
                            //falling false - TODO remove it
                            this.ytemp = (this.currentRow + 1) * this.mapTileSize - this.cwidth / 2;
                        }
                        else {
                            this.ytemp += this.dy;
                        }
                    }
                    this.calculateCorners(this.xdest, this.y);
                    if (this.dx < 0) {
                        if (this.insideTile) {
                            this.dx = 0;
                            this.xtemp = ((this.currentColumn + 1) * this.mapTileSize) + 4; //TODO TEST and explore it
                            this.insideTile = false;
                        }
                        else {
                            if (this.topLeft || this.bottomLeft) {
                                this.dx = 0;
                                this.xtemp = this.currentColumn * this.mapTileSize + this.cwidth / 2;
                            }
                            else {
                                this.xtemp += this.dx;
                            }
                        }
                    }
                    if (this.dx > 0) {
                        if (this.insideTile) {
                            this.dx = 0;
                            this.xtemp = ((this.currentColumn) * this.mapTileSize - this.cwidth / 2) - 2;
                            this.insideTile = false;
                        }
                        else {
                            if (this.topRight || this.bottomRight) {
                                this.dx = 0;
                                this.xtemp = (this.currentColumn + 1) * this.mapTileSize - this.cwidth / 2;
                            }
                            else {
                                this.xtemp += this.dx;
                            }
                        }
                    }
                };
                MapObject.prototype.setPosition = function (x, y) {
                    this.x = x;
                    this.y = y;
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
                    if (!this.directions[_direction])
                        return console.log("Wrong direction. Sent: ", _direction);
                    for (var key in Object.keys(this.directions)) {
                        if (key == _direction) {
                            this.directions[key] = true;
                            this.currentDirection = _direction;
                        }
                        else {
                            this.directions[key] = false;
                        }
                    }
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