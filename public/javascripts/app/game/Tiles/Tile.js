System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Tile;
    return {
        setters:[],
        execute: function() {
            Tile = (function () {
                function Tile(_stage, tileData, _x, _y) {
                    this.pixiSprite = null; //PixiSprite
                    this.type = null; //tip Tile-a
                    this.key = null;
                    this.stage = null; //stage - scene which holds the game
                    this.x = 0;
                    this.y = 0;
                    this.blocking = true;
                    this.x = _x;
                    this.y = _y;
                    this.type = tileData.type;
                    this.key = tileData.key;
                    this.stage = _stage;
                    this.blocking = tileData.blocking;
                    if (tileData.pixiSpriteTexture) {
                        this.pixiSprite = new PIXI.Sprite(tileData.pixiSpriteTexture);
                        this.pixiSprite.position.set(this.x, this.y);
                        //this.pixiSprite.scale.set(Config.imageScale);
                        this.addImageToStage();
                    }
                }
                Tile.prototype.addImageToStage = function () {
                    if (this.pixiSprite)
                        this.stage.addChild(this.pixiSprite);
                };
                Tile.prototype.removeImageFromStage = function () {
                    if (this.pixiSprite)
                        this.stage.removeChild(this.pixiSprite);
                };
                Tile.prototype.getImage = function () {
                    return this.pixiSprite;
                };
                Tile.prototype.getType = function () {
                    return this.type;
                };
                Tile.prototype.isBlocking = function () {
                    return this.blocking;
                };
                Tile.prototype.destroyTile = function () {
                    this.removeImageFromStage();
                    this.pixiSprite = null;
                    this.type = null;
                    delete this;
                };
                return Tile;
            }());
            exports_1("Tile", Tile);
        }
    }
});
//# sourceMappingURL=Tile.js.map