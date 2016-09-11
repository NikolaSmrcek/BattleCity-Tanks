System.register(['./MapObject', '../Config/Config', './Bullet', '../../sockets/socketController'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var MapObject_1, Config_1, Bullet_1, socketController_1;
    var Tank;
    return {
        setters:[
            function (MapObject_1_1) {
                MapObject_1 = MapObject_1_1;
            },
            function (Config_1_1) {
                Config_1 = Config_1_1;
            },
            function (Bullet_1_1) {
                Bullet_1 = Bullet_1_1;
            },
            function (socketController_1_1) {
                socketController_1 = socketController_1_1;
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
                    this.mana = 0;
                    this.maxMana = 0;
                    this.bulletManaCost = 0;
                    this.healthPoints = 0;
                    this.maximumHealthPoints = 0;
                    //for disapearing effect
                    this.flinching = false;
                    this.flinchCounter = 0;
                    this.flinchStop = 0;
                    this.spawning = false;
                    this.shooting = false;
                    this.enemyTanks = null;
                    this.bullets = null;
                    this.score = 0;
                    //TODO change way or place to hold SpriteUtilites and texture
                    this.pixiObject = null;
                    this.gameId = "";
                    this.pixiObject = pixiObject;
                    this.initialDirection = _direction;
                    this.tankOwner = pixiObject.tankOwner || "";
                    this.tankColour = pixiObject.tankColour;
                    this.tankType = pixiObject.tankType;
                    this.isMyTank = pixiObject.isMyTank || false;
                    this.score = 0;
                    this.gameId = pixiObject.gameId;
                    this.bullets = new Array();
                    this.cwidth = Config_1.Config.entityTileSize * Config_1.Config.imageScale; //TODO check if * imageScale is neccesary
                    this.cheight = Config_1.Config.entityTileSize * Config_1.Config.imageScale;
                    this.flinchStop = Config_1.Config.flinchStop;
                    //TODO TEST
                    this.movementSpeed = 2;
                    this.maxMovementSpeed = 2;
                    this.slowingSpeed = 1;
                    this.setupTank(pixiObject);
                }
                Tank.prototype.checkObjects = function () {
                    if (!(this.enemyTanks instanceof Array))
                        return console.log("Enemy tanks are not array");
                    for (var i = 0; i < this.enemyTanks.length; i++) {
                        //checking if any of the enemy tanks if colliding with our(my)Tank - if it is we stop the movement of our tank
                        if (this.intersects(this.enemyTanks[i])) {
                            this.dx = 0;
                            this.dy = 0;
                            this.xtemp = this.x;
                            this.ytemp = this.y;
                        }
                        //bullet set removable
                        for (var j = 0; j < this.bullets.length; j++) {
                            //for loop where we check if the bullets collided, if they did just remove them - nothing happens
                            for (var k = 0; k < this.enemyTanks[i].bullets.length; k++) {
                                if (this.bullets[j].intersects(this.enemyTanks[i].bullets[k])) {
                                    this.bullets[j].setRemove();
                                    this.enemyTanks[i].bullets[k].setRemove();
                                }
                            }
                            if (this.bullets[j].intersects(this.enemyTanks[i])) {
                                //TODO add explosion animation to tank
                                if (this.isMyTank)
                                    socketController_1.SocketController.emit("gameTankHit", { tankOwner: this.tankOwner, gameId: this.gameId });
                                this.enemyTanks[i].setHit(this.bullets[j].getBulletDamage());
                                this.bullets[j].setRemove();
                                break;
                            }
                        }
                    } //end of for loop enemyTanks
                };
                Tank.prototype.setHit = function (bulletDamage) {
                    if (bulletDamage === void 0) { bulletDamage = 1; }
                    //TODO notify others on hit
                    if (this.flinching)
                        return;
                    this.healthPoints -= bulletDamage;
                    if (this.healthPoints <= 0 && !this.flinching) {
                        //TODO explosion
                        this.setAnimation("explosion");
                    }
                };
                //smoothing the movement
                Tank.prototype.getNextPosition = function () {
                    //if (this.idle) return;
                    //(this.isMyTank && !Keys.isSomeKeyPressed) || Keys.checkKeyPress("shoot") 
                    if (this.idle || this.shooting) {
                        this.dx = 0;
                        this.dy = 0;
                        return;
                    }
                    var maxSpeed = this.maxMovementSpeed;
                    // && (Keys.currentKeyPressed && Keys.currentKeyPressed.name == "down")
                    // this.directions["left"]
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
                Tank.prototype.spawnTank = function (x, y) {
                    if (x === void 0) { x = null; }
                    if (y === void 0) { y = null; }
                    //TODO REMOVE this way of working - we will always get from a server side position where we spawned - or we will notify others
                    var respawnX = x || this.initialX;
                    var respawnY = y || this.initialY;
                    this.bulletManaCost = Config_1.Config.bulletManaCost;
                    this.maxMana = Config_1.Config.maxTankMana;
                    this.mana = this.maxMana;
                    this.healthPoints = Config_1.Config.tankHealthPoints;
                    this.maximumHealthPoints = Config_1.Config.maximumTankHealthPoints;
                    this.flinching = true;
                    this.flinchCounter = 0;
                    this.setPosition(respawnX, respawnY);
                    this.setAnimation("spawn");
                };
                Tank.prototype.checkFlinching = function () {
                    //checking if flicnking and updateing counter
                    if (this.flinching) {
                        this.flinchCounter++;
                        if (this.flinchCounter > this.flinchStop) {
                            this.flinching = false;
                        }
                        //if it is still flinching we are checking shall we display the surroundings or not
                        if (this.flinching) {
                            if (this.flinchCounter % 10 < 5) {
                                //TODO add anohter "white" animation around tank that is constantly on
                                this.currentAnimation.visible = false;
                            }
                            else {
                                this.currentAnimation.visible = true;
                            }
                        }
                        else {
                            //flinching is over return this tank to visible
                            this.currentAnimation.visible = true;
                        }
                    }
                };
                Tank.prototype.setupTank = function (_pixiObject) {
                    var _this = this;
                    this.setupAnimations(_pixiObject.texture, Config_1.Config.tankAnimations[_pixiObject.tankColour][_pixiObject.tankType], _pixiObject.u);
                    this.animations["spawn"].onComplete = function () {
                        _this.setDirection(_this.initialDirection);
                    };
                    this.animations["explosion"].onComplete = function () {
                        _this.spawnTank();
                    };
                    this.spawnTank();
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
                Tank.prototype.setShooting = function () {
                    this.shooting = true;
                };
                Tank.prototype.removeShooting = function () {
                    this.shooting = false;
                };
                Tank.prototype.addBullet = function () {
                    //TODO mana or timedelay
                    if (this.mana >= this.bulletManaCost) {
                        this.mana -= this.bulletManaCost;
                        this.bullets.push(new Bullet_1.Bullet(this.tileMap, {
                            stage: this.stage,
                            u: this.pixiObject.u,
                            texture: this.pixiObject.texture,
                            tankOwner: this.tankOwner,
                            isMyTank: this.isMyTank,
                            x: this.x,
                            y: this.y
                        }, this.currentDirection));
                    }
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
                            this.bullets[i].safetlyRemove();
                            delete this.bullets[i];
                            this.bullets.splice(i, 1);
                            i--;
                        }
                        else {
                            this.bullets[i].animate();
                        }
                    }
                    //Updejting mana for bullets
                    this.mana += Config_1.Config.manaPerFPS;
                    if (this.mana > this.maxMana)
                        this.mana = this.maxMana;
                    this.checkFlinching();
                }; //end of animate function
                return Tank;
            }(MapObject_1.MapObject));
            exports_1("Tank", Tank);
        }
    }
});
//# sourceMappingURL=Tank.js.map