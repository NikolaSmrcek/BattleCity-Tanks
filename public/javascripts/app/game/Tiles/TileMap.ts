import { Config } from '../Config/Config'; //Beacuse if we do Config it has to be module.class.function, this way is class.function
import { Tile } from './Tile';
declare var PIXI: any;

export class TileMap {

	private stage: any = null; //pixiStage
	private numRows: number = null;
	private numCols: number = null;
	public tiles: any = {};
	public map: any = null;
	private u: any = null; //PIXI sprite utilities


	constructor(_stage, _u) {
		this.stage = _stage;
		this.u = _u;
		this.numRows = Math.round(Config.gameWidth / (Config.tileSize));
		this.numCols = Math.round(Config.gameHeight / (Config.tileSize));
	}

	public loadTiles(texture) {
		for (let key in Config.tileTypes) {
			let tile = Config.tileTypes[key];
			if (tile.skip) continue;
			let spriteTexture = this.u.frame(texture, tile.x, tile.y, Config.tileSize, Config.tileSize);
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
		}

	}

	public loadMap(_map) {
		_map = Config.demoMap2; //TODO send it
		if (typeof _map !== "string") return;
		//for now default Map border will be applied, when making map need to take that in mind
		this.map = new Array(this.numRows).fill(new Array(this.numCols))
		//console.log("Children lenght: ", this.stage.children.length);

		let rows = _map.split("|");
		if (rows.length != this.numRows) return console.log("Rows should match to extract map.", rows.length , " "+this.numRows);
		for (let row = 0; row < rows.length; row++) {
			let columns = rows[row].split(",");
			//if (columns.length != this.numCols) return console.log("Columns should match to extract map.");
			for (let column = 0; column < columns.length; column++) {
				this.addTile(row, column, Config.tileTypesMapping[columns[column]], this.map);
			}
		}

	}

	public isTile(mapRow, mapColumn) {
		if (this.map[mapRow][mapColumn]) {
			return true;
		}
		return false;
	}

	public addTile(mapRow, mapColumn, tileType, _map) {
		let x = mapRow * Config.tileSize,
			y = mapColumn * Config.tileSize,
			tile = new Tile(this.stage, this.tiles[tileType], x, y);
		_map[mapRow][mapColumn] = tile;
	}

	public getNumRows(){
		return this.numRows;
	}

	public getNumCols(){
		return this.numCols;
	}

	public isTileBlocking(row: number, column: number){
		return this.map[row,column].isBlocking();
	}

	//TODO getTypeOfTile

}