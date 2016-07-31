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
                function MapObject(_tileMap, _pixiObject, entityTileSize, bullet) {
                    if (entityTileSize === void 0) { entityTileSize = null; }
                    if (bullet === void 0) { bullet = false; }
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
                    this.initialX = 0;
                    this.initialY = 0;
                    this.initialDirection = "";
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
                    this.topTile = false;
                    this.bottomTile = false;
                    this.leftTile = false;
                    this.rightTile = false;
                    this.blockingTiles = null;
                    this.tileMap = {};
                    //pixiStage
                    this.stage = {};
                    this.graphics = null;
                    this.bullet1 = false;
                    this.tileMap = _tileMap;
                    this.entityTileSize = entityTileSize || Config_1.Config.entityTileSize;
                    //TODO rethink where and how to put initial positioning
                    this.x = _pixiObject.x;
                    this.y = _pixiObject.y;
                    this.initialX = this.x;
                    this.initialY = this.y;
                    this.stage = _pixiObject.stage;
                    this.imageScale = Config_1.Config.imageScale;
                    this.mapTileSize = Config_1.Config.tileSize;
                    //TODO remove everything with bullet1
                    this.bullet1 = bullet;
                    /*
                    this.graphics = new PIXI.Graphics();
                    this.graphics.lineStyle(1, 0xFF0000);
                    this.graphics.drawRect(37 * 8, 31 * 8, 8, 8);
                    this.stage.addChild(this.graphics);
                    */
                }
                MapObject.prototype.isTileBlockingWrapper = function (row, column) {
                    var blocking = this.tileMap.isTileBlocking(row, column);
                    if (blocking)
                        this.blockingTiles.push(this.tileMap.getTile(row, column));
                    return blocking;
                };
                MapObject.prototype.calculateCorners = function (_x, _y) {
                    var leftTile = parseInt(((_x - (this.cwidth / 2)) / this.mapTileSize).toString(), 10);
                    var rightTile = parseInt(((_x + (this.cwidth / 2)) / this.mapTileSize).toString(), 10);
                    var topTile = parseInt(((_y - (this.cheight / 2)) / this.mapTileSize).toString(), 10);
                    var bottomTile = parseInt(((_y + (this.cheight / 2)) / this.mapTileSize).toString(), 10);
                    if (topTile < 0 || bottomTile >= this.tileMap.getNumRows() || leftTile < 0 || rightTile >= this.tileMap.getNumCols()) {
                        this.leftTile = this.rightTile = this.topTile = this.bottomTile = true; //todo check
                        return;
                    }
                    var rows = Math.abs(topTile - bottomTile) + 1;
                    var columns = Math.abs(leftTile - rightTile) + 1;
                    //bottom
                    for (var row = topTile; row < (topTile + rows); row++) {
                        this.leftTile = (this.leftTile == false) ? this.isTileBlockingWrapper(row, leftTile) : this.leftTile;
                        this.rightTile = (this.rightTile == false) ? this.isTileBlockingWrapper(row, rightTile) : this.rightTile;
                    }
                    //right
                    for (var column = leftTile; column < (leftTile + columns); column++) {
                        this.topTile = (this.topTile == false) ? this.isTileBlockingWrapper(topTile, column) : this.topTile;
                        this.bottomTile = (this.bottomTile == false) ? this.isTileBlockingWrapper(bottomTile, column) : this.bottomTile;
                    }
                    //TODO remove tihs comment
                    /*
                    if (this.bullet1) {
                        console.log("****************************");
                        console.log("Left tile: ", this.leftTile, " Right tile: ", this.rightTile, " Top tile: ", this.topTile, " bottom tile: ", this.bottomTile);
                        console.log("Left tile: ", leftTile, " Right tile: ", rightTile, " Top tile: ", topTile, " bottom tile: ", bottomTile);
                        console.log("Current row: ", this.currentRow, " current column: ", this.currentColumn);
                        console.log("****************************");
                    }
                    */
                };
                //used for checking collision between various game objects
                MapObject.prototype.intersects = function (o1, o2) {
                    if (o2 === void 0) { o2 = this; }
                    var hit = false, combinedHalfWidths, combinedHalfHeights, vx, vy;
                    //we use anchor 0.5 in Config that's why we don't calculate center X and center Y, our x and y is allready centered
                    vx = (o1.xtemp || o1.x) - (o2.xtemp || o2.x);
                    vy = (o1.ytemp || o1.x) - (o2.ytemp || o2.y);
                    combinedHalfWidths = (o1.cwidth / 2) + (o2.cwidth / 2);
                    combinedHalfHeights = (o1.cheight / 2) + (o2.cheight / 2);
                    if (Math.abs(vx) < combinedHalfWidths) {
                        if (Math.abs(vy) < combinedHalfHeights) {
                            hit = true;
                        }
                        else {
                            hit = false;
                        }
                    }
                    else {
                        hit = false;
                    }
                    return hit;
                };
                MapObject.prototype.checkTileMapCollision = function () {
                    this.blockingTiles = new Array();
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
                        if (typeof this.currentAnimation.stop === "function") {
                            this.currentAnimation.stop();
                        }
                        this.currentAnimation.visible = false;
                    }
                    this.currentAnimation = this.animations[_animation];
                    this.cwidth = this.currentAnimation.collisionWidth;
                    this.cheight = this.currentAnimation.collisionHeight;
                    //this.currentAnimation.play();
                    if (typeof this.currentAnimation.play === "function") {
                        this.currentAnimation.play();
                    }
                    this.currentAnimation.visible = true;
                };
                MapObject.prototype.setVector = function (dx, dy) {
                    this.dx = dx;
                    this.dy = dy;
                };
                MapObject.prototype.setupFlinchAnimation = function (texture, coordinates, u) {
                    if (Object.keys(coordinates).length === 0 && coordinates.constructor === Object)
                        return console.log("Coordinates are empty object.");
                };
                MapObject.prototype.setupAnimations = function (texture, coordinates, u) {
                    if (Object.keys(coordinates).length === 0 && coordinates.constructor === Object)
                        return console.log("Coordinates are empty object.");
                    for (var k in coordinates) {
                        if (Object.keys(coordinates[k]).length === 0 && coordinates[k].constructor === Object)
                            continue;
                        for (var key in coordinates[k]) {
                            var animations = (k === 'animations'), action = coordinates[k][key], width = action.width || this.entityTileSize, height = action.height || this.entityTileSize, textures = animations ?
                                u.frames(texture, action.coordinates, width, height) :
                                u.frame(texture, action.x, action.y, width, height);
                            this.animations[key] = animations ? new PIXI.extras.MovieClip(textures) : new PIXI.Sprite(textures);
                            this.animations[key].collisionWidth = width * this.imageScale; //TODO check if needed to add imageScale
                            this.animations[key].collisionHeight = height * this.imageScale;
                            this.animations[key].anchor.set(Config_1.Config.objectAnchor); //TODO change this to configuration
                            this.animations[key].animationSpeed = action.animationSpeed || Config_1.Config.animationSpeed; //TODO change this to configuration
                            this.animations[key].visible = false;
                            this.animations[key].loop = (typeof action.loop !== "undefined") ? action.loop : true;
                            this.animations[key].position.set(this.x, this.y);
                            this.animations[key].scale.set(this.imageScale);
                            this.stage.addChild(this.animations[key]);
                        }
                    }
                };
                MapObject.prototype.safetlyRemove = function () {
                    for (var key in this.animations) {
                        this.stage.removeChild(this.animations[key]);
                        delete this.animations[key];
                    }
                    this.animations = {};
                };
                MapObject.prototype.removeTileFromMap = function (tile, column) {
                    if (column === void 0) { column = null; }
                    this.tileMap.removeTile(tile, column);
                };
                return MapObject;
            }());
            exports_1("MapObject", MapObject); //end of class	
        }
    }
});
//# sourceMappingURL=MapObject.js.map