System.register(['./MapObject', '../Config/Config', '../Handlers/Keys', './Bullet'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var MapObject_1, Config_1, Keys_1, Bullet_1;
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
            },
            function (Bullet_1_1) {
                Bullet_1 = Bullet_1_1;
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
                    this.enemyTanks = null;
                    this.bullets = null;
                    //TODO change way or place to hold SpriteUtilites and texture
                    this.pixiObject = null;
                    this.pixiObject = pixiObject;
                    this.tankOwner = pixiObject.tankOwner || "";
                    this.tankColour = pixiObject.tankColour;
                    this.tankType = pixiObject.tankType;
                    this.isMyTank = pixiObject.isMyTank || false;
                    this.bullets = new Array();
                    this.cwidth = Config_1.Config.entityTileSize * Config_1.Config.imageScale; //TODO check if * imageScale is neccesary
                    this.cheight = Config_1.Config.entityTileSize * Config_1.Config.imageScale;
                    //TODO TEST
                    this.movementSpeed = 2;
                    this.maxMovementSpeed = 2;
                    this.slowingSpeed = 1;
                    this.setupTank(pixiObject);
                    this.setDirection(_direction);
                }
                Tank.prototype.checkObjects = function () {
                    if (!(this.enemyTanks instanceof Array))
                        return console.log("Enemy tanks are not array");
                    for (var i = 0; i < this.enemyTanks.length; i++) {
                        if (this.checkRectangleCollision(this.enemyTanks[i])) {
                            this.dx = 0;
                            this.dy = 0;
                            this.xtemp = this.x;
                            this.ytemp = this.y;
                        }
                    }
                    //TODO CHECK if bullet hit any tank
                };
                //smoothing the movement
                Tank.prototype.getNextPosition = function () {
                    if (this.isMyTank && !Keys_1.Keys.isSomeKeyPressed) {
                        this.dx = 0;
                        this.dy = 0;
                        return;
                    }
                    var maxSpeed = this.maxMovementSpeed;
                    // && (Keys.currentKeyPressed && Keys.currentKeyPressed.name == "down")
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
                    this.setupAnimations(_pixiObject.texture, Config_1.Config.tankAnimations[_pixiObject.tankColour][_pixiObject.tankType], _pixiObject.u);
                };
                Tank.prototype.getEnemys = function () {
                    return this.enemyTanks;
                };
                Tank.prototype.setEnemys = function (_enemyTanks) {
                    this.enemyTanks = _enemyTanks;
                };
                Tank.prototype.getBullets = function () {
                    return this.bullets;
                };
                Tank.prototype.setBullets = function (_bullets) {
                    this.bullets = _bullets;
                };
                Tank.prototype.addBullet = function () {
                    //TODO mana or timedelay
                    this.bullets.push(new Bullet_1.Bullet(this.tileMap, {
                        stage: this.stage,
                        u: this.pixiObject.u,
                        texture: this.pixiObject.texture,
                        tankOwner: this.tankOwner,
                        isMyTank: this.isMyTank,
                        x: this.x,
                        y: this.y
                    }, this.currentDirection));
                };
                Tank.prototype.animate = function () {
                    this.getNextPosition();
                    this.checkTileMapCollision();
                    this.checkObjects();
                    this.setPosition(this.xtemp, this.ytemp);
                    //Updating depending objects of parent
                    //animate bullets
                    for (var i = 0; i < this.bullets.length; i++) {
                        if (this.bullets[i].isRemovable()) {
                            //TODO delete Enemy
                            this.bullets[i].safetlyRemove();
                            delete this.bullets[i];
                            this.bullets.splice(i, 1);
                            i--;
                        }
                        else {
                            this.bullets[i].animate();
                        }
                    }
                    //stage children
                }; //end of animate function
                return Tank;
            }(MapObject_1.MapObject));
            exports_1("Tank", Tank);
        }
    }
});
//# sourceMappingURL=Tank.js.map