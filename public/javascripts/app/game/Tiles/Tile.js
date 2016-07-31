System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Tile;
    return {
        setters:[],
        execute: function() {
            Tile = (function () {
                /*
                private blocking: boolean = true;
                private removable: boolean = false;
                private type: any = null; //tip Tile-a
                public key: string = null;
                */
                function Tile(_stage, tileData, _x, _y, mapRow, mapColumn) {
                    this.pixiSprite = null; //PixiSprite
                    this.stage = null; //stage - scene which holds the game
                    this.x = 0;
                    this.y = 0;
                    this.tileData = null;
                    this.mapRow = 0;
                    this.mapColumn = 0;
                    this.mapRow = mapRow;
                    this.mapColumn = mapColumn;
                    this.x = _x;
                    this.y = _y;
                    this.stage = _stage;
                    /*
                    this.type = tileData.type;
                    this.key = tileData.key;
                    this.blocking = tileData.blocking;
                    this.removable = tileData.removable;
                    */
                    if (tileData.pixiSpriteTexture) {
                        this.pixiSprite = new PIXI.Sprite(tileData.pixiSpriteTexture);
                        this.pixiSprite.position.set(this.x, this.y);
                        //this.pixiSprite.scale.set(Config.imageScale);
                        this.addImageToStage();
                    }
                    //TODO check if this is potentional memory throtteling
                    //delete tileData.pixiSpriteTexture;
                    this.tileData = tileData.tileData;
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
                    return this.tileData.type;
                };
                Tile.prototype.isBlocking = function () {
                    //console.log("Tile data: ", this.tileData);
                    return (this.tileData !== null && typeof this.tileData !== "undefined") ? this.tileData.blocking : true;
                };
                Tile.prototype.isRemovable = function () {
                    return (this.tileData !== null && typeof this.tileData !== "undefined") ? this.tileData.removable : true;
                };
                Tile.prototype.isBulletBlocking = function () {
                    return (this.tileData !== null && typeof this.tileData !== "undefined") ? this.tileData.bulletBlocking : true;
                };
                Tile.prototype.destroyTile = function () {
                    this.removeImageFromStage();
                    this.pixiSprite = null;
                    this.tileData = null;
                    this.stage = null;
                    delete this;
                };
                return Tile;
            }());
            exports_1("Tile", Tile);
        }
    }
});
//# sourceMappingURL=Tile.js.map