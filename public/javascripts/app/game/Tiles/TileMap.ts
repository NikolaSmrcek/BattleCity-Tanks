import { Config } from '../Config/Config'; //Beacuse if we do Config it has to be module.class.function, this way is class.function
import { Tile } from './Tile';
declare var PIXI: any;

export class TileMap {

	private stage: any = null; //pixiStage
	private numRows: number = null;
	private numCols: number = null;
	public tiles: any = {};
	public map: any = {};
	private u: any = null; //PIXI sprite utilities


	constructor(_stage, _u) {
		this.stage = _stage;
		this.u = _u;
		this.numRows = Math.round(Config.gameWidth / (Config.tileSize));
		this.numCols = Math.round(Config.gameHeight / (Config.tileSize));
		this.map = {};
	}

	public loadTiles(texture) {
		for (let key in Config.tileTypes) {
			let tile = Config.tileTypes[key];
			let spriteTexture = tile.skip ? null : this.u.frame(texture, tile.x, tile.y, Config.tileSize, Config.tileSize);
			this.tiles[key] = {
				pixiSpriteTexture: spriteTexture,
				tileData: tile,
				key: key
			};
		}
		console.log("Typed, ", this.tiles);
	}

	public loadMap(_map) {
		_map = _map || Config.demoMap2; //TODO send it - no demo map
		if (typeof _map !== "string") return;
		//for now default Map border will be applied, when making map need to take that in mind

		this.map = new Array();
		let rows = _map.split("|");
		if (rows.length != this.numRows) return console.log("Rows should match to extract map.", rows.length, " " + this.numRows);
		for (let row = 0; row < rows.length; row++) {
			this.map.push(new Array());
			let columns = rows[row].split(",");
			//if (columns.length != this.numCols) return console.log("Columns should match to extract map.");
			for (let column = 0; column < columns.length; column++) {
				this.addTile(row, column, Config.tileTypesMapping[columns[column]]);
			}
		}
	}

	public isTile(mapRow, mapColumn) {
		if (this.map[mapRow][mapColumn]) {
			return true;
		}
		return false;
	}

	public addTile(mapRow, mapColumn, tileType) {
		let y = parseInt((mapRow * Config.tileSize).toString(), 10),
			x = parseInt((mapColumn * Config.tileSize).toString(), 10),
			tile = new Tile(this.stage, this.tiles[tileType], x, y, mapRow, mapColumn);
		this.map[mapRow][mapColumn] = tile;
		//TODO remove this comment
		/*
		if (tile.key == "brick") {
			console.log("Added to map tile: ", tile, " row ", mapRow, " column ", mapColumn, " x ", x, " y ", y);
		}
		*/
		//console.log("Added to map tile: ", tile, " row ", mapRow, " column ", mapColumn);
	}

	//we are replacing blocking tile with "nothing" tile, tile argument can be tile object or row
	public removeTile(tile: any, column: number = null) {
		if (!tile && tile != 0) return console.log("Invalid tile object or row.");
		let tileObject = null,
			blocking = false;
		if (this.isTileBulletBlocking(tile, column) && this.isTileRemovable(tile, column)) {
			if (typeof tile === "object") {
				tile.destroyTile();
				this.addTile(tile.mapRow, tile.mapColumn, "nothing");
			} else {
				this.map[tile][column].destroyTile();
				this.addTile(tile, column, "nothing");
			}
		}
		else {
			console.log("Tile allready is not blocking or non removable");
		}
	}

	public getNumRows() {
		return this.numRows;
	}

	public getNumCols() {
		return this.numCols;
	}

	public getTile(row: any, column: number = null) {
		if (!row && row != 0) return console.log("Invalid tile object or row.");
		let tile = null;
		if (column != null) {
			tile = this.map[row][column];
		}
		else {
			tile = row;
		}
		return tile;
	}

	public isTileBlocking(row: any, column: number = null): any {
		if (!row && row != 0) return console.log("Invalid tile object or row.");
		let blocking = false;
		if (column != null) {
			blocking = this.map[row][column].isBlocking();
		}
		else {
			blocking = row.isBlocking();
		}

		return blocking;
	}

	public isTileBulletBlocking(row: any, column: number = null): any {
		if (!row && row != 0) return console.log("Invalid tile object or row.");
		let blocking = false;
		if (column != null) {
			blocking = this.map[row][column].isBulletBlocking();
		}
		else {
			//console.log("TILR: ", row);
			blocking = row.isBulletBlocking();
		}

		return blocking;
	}

	public isTileRemovable(row: any, column: number = null): any {
		if (!row && row != 0) return console.log("Invalid tile object or row.");
		let removable = false;
		if (column != null) {
			removable = this.map[row][column].isRemovable();
		}
		else {
			removable = row.isRemovable();
		}
		return removable;
	}

}