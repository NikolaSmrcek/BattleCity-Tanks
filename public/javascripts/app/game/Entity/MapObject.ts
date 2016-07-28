import { Config } from '../Config/Config';
declare var PIXI: any;
declare var SpriteUtilities: any;

export class MapObject {

	public entityTileSize: number = 0;
	public mapTileSize: number = 0;
	public imageScale: number = 0;

	protected animations: any = {};
	protected currentAnimation: any = null;

	protected directions: any = {
		left: false,
		right: false,
		up: false,
		down: false
	}

	protected currentDirection: string = "";

	protected x: number = 0;
	protected y: number = 0;
	protected dx: number = 0;
	protected dy: number = 0;

	//movement
	protected movementSpeed: number = 0;
	protected maxMovementSpeed: number = 0;
	protected slowingSpeed: number = 0;

	//For collision detecion
	protected currentRow: number = 0;
	protected currentColumn: number = 0;
	protected xdest: number = 0;
	protected ydest: number = 0;
	protected xtemp: number = 0;
	protected ytemp: number = 0;
	public cwidth: number = 0;
	public cheight: number = 0;


	protected topLeft: boolean = false;
	protected topRight: boolean = false;
	protected bottomLeft: boolean = false;
	protected bottomRight: boolean = false;

	protected topTile: boolean = false;
	protected bottomTile: boolean = false;
	protected leftTile: boolean = false;
	protected rightTile: boolean = false;

	protected tileMap: any = {};

	//pixiStage
	protected stage: any = {};
	protected graphics: any = null;

	constructor(_tileMap: any, _pixiObject: any, entityTileSize: number = null) {
		this.tileMap = _tileMap;
		this.entityTileSize = entityTileSize || Config.entityTileSize;
		//TODO rethink where and how to put initial positioning
		this.x = _pixiObject.x;
		this.y = _pixiObject.y;

		this.stage = _pixiObject.stage;
		this.imageScale = Config.imageScale;
		this.mapTileSize = Config.tileSize;

		/*
		this.graphics = new PIXI.Graphics();
		this.graphics.lineStyle(1, 0xFF0000);
		this.graphics.drawRect(37 * 8, 31 * 8, 8, 8);
		this.stage.addChild(this.graphics);
		*/
	}

	public calculateCorners(_x: number, _y: number) {
		let leftTile = parseInt(((_x - (this.cwidth / 2)) / this.mapTileSize).toString(), 10);
		let rightTile = parseInt(((_x + (this.cwidth / 2)) / this.mapTileSize).toString(), 10);
		let topTile = parseInt(((_y - (this.cheight / 2)) / this.mapTileSize).toString(), 10);
		let bottomTile = parseInt(((_y + (this.cheight / 2)) / this.mapTileSize).toString(), 10);

		if (topTile < 0 || bottomTile >= this.tileMap.getNumRows() || leftTile < 0 || rightTile >= this.tileMap.getNumCols()) {
			this.topLeft = this.topRight = this.bottomLeft = this.bottomRight = true; //todo check
			return;
		}

		
		for (let row = topTile; row < bottomTile; row++) {
			this.leftTile = (this.leftTile == false) ? this.tileMap.isTileBlocking(row, leftTile) : this.leftTile;
			this.rightTile = (this.rightTile == false) ? this.tileMap.isTileBlocking(row, rightTile) : this.rightTile;
		}

		for (let column = leftTile; column < rightTile; column++) {
			this.topTile = (this.topTile == false) ? this.tileMap.isTileBlocking(topTile, column) : this.topTile;
			this.bottomTile = (this.bottomTile == false) ? this.tileMap.isTileBlocking(bottomTile, column) : this.bottomTile;
		}
	}

	public checkTileMapCollision() {

		this.currentRow = parseInt((this.y / this.mapTileSize).toString(), 10);
		this.currentColumn = parseInt((this.x / this.mapTileSize).toString(), 10);

		this.xdest = this.x + this.dx;
		this.ydest = this.y + this.dy;

		this.xtemp = this.x;
		this.ytemp = this.y;
		if (this.dx == 0 && this.dy == 0) return;
		this.calculateCorners(this.x, this.ydest);

		if (this.dy < 0) {
			if (this.topTile) {
				this.dy = 0;
				//this.ytemp = this.currentRow * this.mapTileSize + this.cheight / 2;
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
				//falling false - TODO remove it
				//this.ytemp = (this.currentRow + 1) * this.mapTileSize - this.cheight / 2;
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
				//this.xtemp = this.currentColumn * this.mapTileSize + this.cwidth / 2;
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
				//this.xtemp = (this.currentColumn + 1) * this.mapTileSize - this.cwidth / 2;
				this.xtemp = this.x;
				this.rightTile = false;
			}
			else {
				this.xtemp += this.dx;
			}
		}

	}

	public setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
		for (let key in this.animations) {
			this.animations[key].position.set(x, y);
		}
	}

	public getX() {
		return this.x;
	}

	public getY() {
		return this.y;
	}

	public getCWidth() {
		return this.cwidth;
	}

	public getCHeight() {
		return this.cheight;
	}

	public setDirection(_direction: string) {
		if (!this.directions.hasOwnProperty(_direction)) return console.log("Wrong direction. Sent: ", _direction, " directions: ", this.directions);
		for (let key in this.directions) {
			if (key == _direction) {
				this.directions[key] = true;
				this.currentDirection = _direction;
				this.setAnimation(_direction);
			}
			else {
				this.directions[key] = false;
			}
		}
	}

	//TODO shoot

	private setAnimation(_animation: string) {
		if (!this.animations.hasOwnProperty(_animation)) return console.log("Non exsisting animation: ", _animation);
		if (this.currentAnimation) {
			this.currentAnimation.stop();
			this.currentAnimation.visible = false;
		}
		this.currentAnimation = this.animations[_animation];
		this.currentAnimation.play();
		this.currentAnimation.visible = true;
	}

	public setVector(dx: number, dy: number) {
		this.dx = dx;
		this.dy = dy;
	}

}	