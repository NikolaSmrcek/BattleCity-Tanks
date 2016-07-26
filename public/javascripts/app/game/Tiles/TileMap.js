System.register(['../Config/Config', './Tile'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Config_1, Tile_1;
    var TileMap;
    return {
        setters:[
            function (Config_1_1) {
                Config_1 = Config_1_1;
            },
            function (Tile_1_1) {
                Tile_1 = Tile_1_1;
            }],
        execute: function() {
            TileMap = (function () {
                function TileMap(_stage, _u) {
                    this.stage = null; //pixiStage
                    this.numRows = null;
                    this.numCols = null;
                    this.tiles = {};
                    this.map = null;
                    this.u = null; //PIXI sprite utilities
                    this.stage = _stage;
                    this.u = _u;
                    this.numRows = Math.round(Config_1.Config.gameWidth / (Config_1.Config.tileSize));
                    this.numCols = Math.round(Config_1.Config.gameHeight / (Config_1.Config.tileSize));
                }
                TileMap.prototype.loadTiles = function (texture) {
                    for (var key in Config_1.Config.tileTypes) {
                        var tile = Config_1.Config.tileTypes[key];
                        if (tile.skip)
                            continue;
                        var spriteTexture = this.u.frame(texture, tile.x, tile.y, Config_1.Config.tileSize, Config_1.Config.tileSize);
                        this.tiles[key] = {
                            pixiSpriteTexture: spriteTexture,
                            type: tile.type,
                            blocking: tile.blocking,
                            key: key
                        };
                    }
                    this.tiles["nothing"] = {
                        pixiSpriteTexture: null,
                        type: 0,
                        key: "nothing"
                    };
                };
                TileMap.prototype.loadMap = function (_map) {
                    _map = Config_1.Config.demoMap2; //TODO send it
                    if (typeof _map !== "string")
                        return;
                    //for now default Map border will be applied, when making map need to take that in mind
                    this.map = new Array(this.numRows).fill(new Array(this.numCols));
                    //console.log("Children lenght: ", this.stage.children.length);
                    var rows = _map.split("|");
                    if (rows.length != this.numRows)
                        return console.log("Rows should match to extract map.", rows.length, " " + this.numRows);
                    for (var row = 0; row < rows.length; row++) {
                        var columns = rows[row].split(",");
                        //if (columns.length != this.numCols) return console.log("Columns should match to extract map.");
                        for (var column = 0; column < columns.length; column++) {
                            this.addTile(row, column, Config_1.Config.tileTypesMapping[columns[column]], this.map);
                        }
                    }
                };
                TileMap.prototype.isTile = function (mapRow, mapColumn) {
                    if (this.map[mapRow][mapColumn]) {
                        return true;
                    }
                    return false;
                };
                TileMap.prototype.addTile = function (mapRow, mapColumn, tileType, _map) {
                    var x = mapRow * Config_1.Config.tileSize, y = mapColumn * Config_1.Config.tileSize, tile = new Tile_1.Tile(this.stage, this.tiles[tileType], x, y);
                    _map[mapRow][mapColumn] = tile;
                };
                TileMap.prototype.getNumRows = function () {
                    return this.numRows;
                };
                TileMap.prototype.getNumCols = function () {
                    return this.numCols;
                };
                TileMap.prototype.isTileBlocking = function (row, column) {
                    return this.map[row, column].isBlocking();
                };
                return TileMap;
            }());
            exports_1("TileMap", TileMap);
        }
    }
});
//# sourceMappingURL=TileMap.js.map