System.register(['../Config/Config', './MapObject'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Config_1, MapObject_1;
    var Bullet;
    return {
        setters:[
            function (Config_1_1) {
                Config_1 = Config_1_1;
            },
            function (MapObject_1_1) {
                MapObject_1 = MapObject_1_1;
            }],
        execute: function() {
            Bullet = (function (_super) {
                __extends(Bullet, _super);
                function Bullet(_tileMap, pixiObject, _direction) {
                    _super.call(this, _tileMap, pixiObject, null, true);
                    this.tankOwner = "";
                    this.isMyTank = false;
                    this.hit = false;
                    this.remove = false;
                    this.bulletDamage = 0;
                    this.tankOwner = pixiObject.tankOwner || "";
                    this.isMyTank = pixiObject.isMyTank || false;
                    this.movementSpeed = 5;
                    this.bulletDamage = Config_1.Config.bulletDamage;
                    this.setupBullet(pixiObject);
                    this.setDirection(_direction);
                    this.calculateVelocity();
                }
                Bullet.prototype.setupBullet = function (_pixiObject) {
                    var _this = this;
                    this.setupAnimations(_pixiObject.texture, Config_1.Config.bulletAnimations, _pixiObject.u);
                    this.animations["explosion"].onComplete = function () {
                        _this.setRemove();
                    };
                    //console.log("This animations[explosion] bullet: ", this.animations["explosion"]);
                };
                Bullet.prototype.isTileBlockingWrapper = function (row, column) {
                    var blocking = this.tileMap.isTileBulletBlocking(row, column);
                    if (blocking)
                        this.blockingTiles.push(this.tileMap.getTile(row, column));
                    return blocking;
                };
                Bullet.prototype.calculateVelocity = function () {
                    switch (this.currentDirection) {
                        case "left":
                            this.dx -= this.movementSpeed;
                            break;
                        case "right":
                            this.dx += this.movementSpeed;
                            break;
                        case "up":
                            this.dy -= this.movementSpeed;
                            break;
                        case "down":
                            this.dy += this.movementSpeed;
                            break;
                        default: console.log("Unknown direction: ", this.currentDirection);
                    }
                };
                Bullet.prototype.getBulletDamage = function () {
                    return this.bulletDamage;
                };
                Bullet.prototype.setBulletDamage = function (bulletDamage) {
                    if (bulletDamage === void 0) { bulletDamage = 1; }
                    this.bulletDamage = bulletDamage;
                };
                Bullet.prototype.incrementBulletDamage = function (bulletDamage) {
                    if (bulletDamage === void 0) { bulletDamage = 1; }
                    this.bulletDamage += bulletDamage;
                };
                Bullet.prototype.isHit = function () {
                    return this.hit;
                };
                Bullet.prototype.setHit = function () {
                    this.hit = true;
                };
                Bullet.prototype.isRemovable = function () {
                    return this.remove;
                };
                Bullet.prototype.setRemove = function () {
                    this.remove = true;
                };
                Bullet.prototype.checkHit = function () {
                    if (this.dx == 0 && this.dy == 0) {
                        this.setHit();
                        //TODO remove tile that was hit
                        for (var index in this.blockingTiles) {
                            this.removeTileFromMap(this.blockingTiles[index]);
                        }
                        //this.animations("explosion").onComplete
                        //Object removes the maker in our case tank
                        this.setAnimation("explosion");
                    }
                };
                Bullet.prototype.animate = function () {
                    this.checkTileMapCollision();
                    this.setPosition(this.xtemp, this.ytemp);
                    this.checkHit();
                };
                return Bullet;
            }(MapObject_1.MapObject));
            exports_1("Bullet", Bullet);
        }
    }
});
//# sourceMappingURL=Bullet.js.map