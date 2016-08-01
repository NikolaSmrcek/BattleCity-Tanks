import { Config } from '../Config/Config';
declare var PIXI: any;
declare var SpriteUtilities: any;

export class MapObject {

	public entityTileSize: number = 0;
	public mapTileSize: number = 0;
	public imageScale: number = 0;

	protected animations: any = {};
	protected currentAnimation: any = null;
	protected idle: boolean = true;

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

	protected initialX: number = 0;
	protected initialY: number = 0;
	protected initialDirection: string = "";

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

	protected topTile: boolean = false;
	protected bottomTile: boolean = false;
	protected leftTile: boolean = false;
	protected rightTile: boolean = false;

	protected blockingTiles: any = null;

	protected tileMap: any = {};

	//pixiStage
	protected stage: any = {};
	protected graphics: any = null;

	private bullet1: boolean = false;

	constructor(_tileMap: any, _pixiObject: any, entityTileSize: number = null, bullet: boolean = false) {
		this.tileMap = _tileMap;
		this.entityTileSize = entityTileSize || Config.entityTileSize;
		//TODO rethink where and how to put initial positioning
		this.x = _pixiObject.x;
		this.y = _pixiObject.y;

		this.initialX = this.x;
		this.initialY = this.y;

		this.stage = _pixiObject.stage;
		this.imageScale = Config.imageScale;
		this.mapTileSize = Config.tileSize;

		//TODO remove everything with bullet1
		this.bullet1 = bullet;
		/*
		this.graphics = new PIXI.Graphics();
		this.graphics.lineStyle(1, 0xFF0000);
		this.graphics.drawRect(37 * 8, 31 * 8, 8, 8);
		this.stage.addChild(this.graphics);
		*/
	}

	private isTileBlockingWrapper(row, column) {
		let blocking = this.tileMap.isTileBlocking(row, column);
		if (blocking) this.blockingTiles.push(this.tileMap.getTile(row, column));
		return blocking;
	}

	public calculateCorners(_x: number, _y: number) {
		let leftTile = parseInt(((_x - (this.cwidth / 2)) / this.mapTileSize).toString(), 10);
		let rightTile = parseInt(((_x + (this.cwidth / 2)) / this.mapTileSize).toString(), 10);
		let topTile = parseInt(((_y - (this.cheight / 2)) / this.mapTileSize).toString(), 10);
		let bottomTile = parseInt(((_y + (this.cheight / 2)) / this.mapTileSize).toString(), 10);

		if (topTile < 0 || bottomTile >= this.tileMap.getNumRows() || leftTile < 0 || rightTile >= this.tileMap.getNumCols()) {
			this.leftTile = this.rightTile = this.topTile = this.bottomTile = true; //todo check
			return;
		}

		let rows = Math.abs(topTile - bottomTile) + 1;
		let columns = Math.abs(leftTile - rightTile) + 1;

		//bottom
		for (let row = topTile; row < (topTile + rows); row++) {
			this.leftTile = (this.leftTile == false) ? this.isTileBlockingWrapper(row, leftTile) : this.leftTile;
			this.rightTile = (this.rightTile == false) ? this.isTileBlockingWrapper(row, rightTile) : this.rightTile;
		}
		//right
		for (let column = leftTile; column < (leftTile + columns); column++) {
			this.topTile = (this.topTile == false) ? this.isTileBlockingWrapper(topTile, column) : this.topTile;
			this.bottomTile = (this.bottomTile == false) ? this.isTileBlockingWrapper(bottomTile, column) : this.bottomTile;
		}
		//TODO remove tihs comment
		/*
		if (this.bullet1) {
			console.log("****************************");
			console.log("Left tile: ", this.leftTile, " Right tile: ", this.rightTile, " Top tile: ", this.topTile, " bottom tile: ", this.bottomTile);
			console.log("Left tile: ", leftTile, " Right tile: ", rightTile, " Top tile: ", topTile, " bottom tile: ", bottomTile);
			console.log("Current row: ", this.currentRow, " current column: ", this.currentColumn);
			console.log("****************************");
		}
		*/
	}


	//used for checking collision between various game objects
	public intersects(o1: any, o2: any = this) {
		let hit = false,
			combinedHalfWidths,
			combinedHalfHeights,
			vx,
			vy;

		//we use anchor 0.5 in Config that's why we don't calculate center X and center Y, our x and y is allready centered
		vx = (o1.xtemp || o1.x) - (o2.xtemp || o2.x);
		vy = (o1.ytemp || o1.x) - (o2.ytemp || o2.y);

		combinedHalfWidths = (o1.cwidth / 2) + (o2.cwidth / 2);
		combinedHalfHeights = (o1.cheight / 2) + (o2.cheight / 2);

		if (Math.abs(vx) < combinedHalfWidths) {
			if (Math.abs(vy) < combinedHalfHeights) {
				hit = true;
			}
			else {
				hit = false;
			}
		}
		else {
			hit = false;
		}
		return hit;
	}

	public removeIdle(){
		this.idle = false;
	}

	public checkTileMapCollision() {
		this.blockingTiles = new Array();
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

	public setAnimation(_animation: string) {
		if (!this.animations.hasOwnProperty(_animation)) return console.log("Non exsisting animation: ", _animation);
		if (this.currentAnimation) {
			if (typeof this.currentAnimation.stop === "function") {
				this.currentAnimation.stop();
			}
			this.currentAnimation.visible = false;
		}
		this.currentAnimation = this.animations[_animation];
		this.cwidth = this.currentAnimation.collisionWidth;
		this.cheight = this.currentAnimation.collisionHeight;
		//this.currentAnimation.play();
		if (typeof this.currentAnimation.play === "function") {
			this.currentAnimation.play();
		}
		this.currentAnimation.visible = true;
	}

	public setVector(dx: number, dy: number) {
		this.dx = dx;
		this.dy = dy;
	}

	public setupFlinchAnimation(texture, coordinates, u) {
		if (Object.keys(coordinates).length === 0 && coordinates.constructor === Object) return console.log("Coordinates are empty object.");

	}

	public setupAnimations(texture, coordinates, u) {
		if (Object.keys(coordinates).length === 0 && coordinates.constructor === Object) return console.log("Coordinates are empty object.");
		for (let k in coordinates) {
			if (Object.keys(coordinates[k]).length === 0 && coordinates[k].constructor === Object) continue;
			for (let key in coordinates[k]) {
				let animations = (k === 'animations'),
					action = coordinates[k][key],
					width = action.width || this.entityTileSize,
					height = action.height || this.entityTileSize,
					textures = animations ?
						u.frames(texture,
							action.coordinates,
							width,
							height) :
						u.frame(texture,
							action.x,
							action.y,
							width,
							height);

				this.animations[key] = animations ? new PIXI.extras.MovieClip(textures) : new PIXI.Sprite(textures);
				this.animations[key].collisionWidth = width * this.imageScale; //TODO check if needed to add imageScale
				this.animations[key].collisionHeight = height * this.imageScale;
				this.animations[key].anchor.set(Config.objectAnchor); //TODO change this to configuration
				this.animations[key].animationSpeed = action.animationSpeed || Config.animationSpeed; //TODO change this to configuration
				this.animations[key].visible = false;
				this.animations[key].loop = (typeof action.loop !== "undefined") ? action.loop : true;
				this.animations[key].position.set(this.x, this.y);
				this.animations[key].scale.set(this.imageScale);
				this.stage.addChild(this.animations[key]);

			}
		}
	}

	public safetlyRemove() {
		for (let key in this.animations) {
			this.stage.removeChild(this.animations[key]);
			delete this.animations[key];
		}
		this.animations = {};
	}

	protected removeTileFromMap(tile: any, column: number = null) {
		this.tileMap.removeTile(tile, column);
	}

}//end of class	