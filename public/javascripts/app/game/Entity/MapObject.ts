import { Config } from '../Config/Config';

export class MapObject {

	public entityTileSize: number = 0;
	public mapTileSize: number = 0;
	public imageScale: number = 0;

	private animations: any = {};
	private currentAnimation: any = {};

	private directions: any = {
		left: false,
		right: false,
		up: false,
		down: false
	}

	private currentDirection: string = "";

	private x: number = 0;
	private y: number = 0;
	private dx: number = 0;
	private dy: number = 0;

	//For collision detecion
	private currentRow: number = 0;
	private currentColumn: number = 0;
	private xdest: number = 0;
	private ydest: number = 0;
	private xtemp: number = 0;
	private ytemp: number = 0;
	public cwidth: number = 0;
	public cheight: number = 0;


	private topLeft: boolean = false;
	private topRight: boolean = false;
	private bottomLeft: boolean = false;
	private bottomRight: boolean = false;
	private insideTile: boolean = false;

	private tileMap: any = {};

	constructor(_tileMap: any, _direction: string, entityTileSize: number = null) {
		this.tileMap = _tileMap;
		this.entityTileSize = entityTileSize || Config.entityTileSize;
		this.imageScale = Config.imageScale;
		this.mapTileSize = Config.tileSize;
		//TODO change other directions to false, set new facing to true
		this.setDirection(_direction);
	}

	public calculateCorners(x: number, y: number) {
		let leftTile = Math.round((this.x - (this.cwidth / 2)) / this.mapTileSize);
		let rightTile = Math.round((this.x + (this.cwidth / 2) - 1) / this.mapTileSize);
		let topTile = Math.round((this.y - (this.cheight / 2)) / this.mapTileSize);
		let bottomTile = Math.round((this.y - (this.cheight / 2) - 1) / this.mapTileSize);

		if (topTile < 0 || bottomTile >= this.tileMap.getNumRows() || leftTile < 0 || rightTile >= this.tileMap.getNumCols()) {
			this.topLeft = this.topRight = this.bottomLeft = this.bottomRight = this.insideTile = false;
			return;
		}

		this.topLeft = this.tileMap.isTileBlocking(topTile, leftTile);
		this.topRight = this.tileMap.isTileBlocking(topTile, rightTile);
		this.bottomLeft = this.tileMap.isTileBlocking(bottomTile, leftTile);
		this.bottomRight = this.tileMap.isTileBlocking(bottomTile, rightTile);
		this.insideTile = this.tileMap.isTileBlocking(this.currentRow, this.currentColumn);

	}

	public checkTileMapCollision() {
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
			else{
				if(this.topLeft || this.bottomLeft){
					this.dx = 0;
					this.xtemp = this.currentColumn * this.mapTileSize + this.cwidth / 2;
				}
				else{
					this.xtemp += this.dx;
				}
			}
		}

		if(this.dx > 0){
			if(this.insideTile){
				this.dx = 0;
				this.xtemp = ((this.currentColumn) * this.mapTileSize - this.cwidth / 2) - 2;
				this.insideTile = false;
			}
			else{
				if(this.topRight || this.bottomRight){
					this.dx = 0;
					this.xtemp = (this.currentColumn + 1) * this.mapTileSize - this.cwidth / 2;
				}
				else{
					this.xtemp += this.dx;
				}
			}
		}

	}

	public setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public getX() {
		return this.x;
	}

	public getY() {
		return this.y;
	}

	public getCWidth(){
		return this.cwidth;
	}

	public getCHeight(){
		return this.cheight;
	}

	public setDirection(_direction: string) {
		if (!this.directions[_direction]) return console.log("Wrong direction. Sent: ", _direction);
		for (let key in Object.keys(this.directions)) {
			if (key == _direction) {
				this.directions[key] = true;
				this.currentDirection = _direction;
			}
			else {
				this.directions[key] = false;
			}
		}
	}

	public setVector(dx: number, dy: number) {
		this.dx = dx;
		this.dy = dy;
	}

}	