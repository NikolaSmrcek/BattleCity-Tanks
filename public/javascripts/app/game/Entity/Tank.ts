import { MapObject } from './MapObject';
import { Config } from '../Config/Config';
import { Keys } from '../Handlers/Keys';
import { Bullet } from './Bullet';

declare var PIXI: any;

export class Tank extends MapObject {

	public tankOwner: string = "";
	public tankColour: string = "";
	public tankType: string = "";
	public isMyTank: boolean = false;

	public enemyTanks: any = null;
	public bullets: any = null;

	//TODO change way or place to hold SpriteUtilites and texture
	public pixiObject: any = null;

	//pixiObject must have a texture, tankColour, tankType, tankOwner and isMyTank and SpriteUtilites as u
	//pixiObject has initial x and y coordinates, stage od the pixi gameAlso
	constructor(_tileMap: any, pixiObject: any, _direction: string) {
		super(_tileMap, pixiObject);

		this.pixiObject = pixiObject;

		this.tankOwner = pixiObject.tankOwner || "";
		this.tankColour = pixiObject.tankColour;
		this.tankType = pixiObject.tankType;
		this.isMyTank = pixiObject.isMyTank || false;

		this.bullets = new Array();

		this.cwidth = Config.entityTileSize * Config.imageScale; //TODO check if * imageScale is neccesary
		this.cheight = Config.entityTileSize * Config.imageScale;


		//TODO TEST
		this.movementSpeed = 2;
		this.maxMovementSpeed = 2;
		this.slowingSpeed = 1;

		this.setupTank(pixiObject);
		this.setDirection(_direction);
	}

	public checkObjects() {
		if (!(this.enemyTanks instanceof Array)) return console.log("Enemy tanks are not array");
		for (let i = 0; i < this.enemyTanks.length; i++) {
			if (this.checkRectangleCollision(this.enemyTanks[i])) {
				this.dx = 0;
				this.dy = 0;
				this.xtemp = this.x;
				this.ytemp = this.y;
			}
		}
		//TODO CHECK if bullet hit any tank
	}

	//smoothing the movement
	private getNextPosition() {
		if (this.isMyTank && !Keys.isSomeKeyPressed) {
			this.dx = 0;
			this.dy = 0;
			return;
		}
		let maxSpeed = this.maxMovementSpeed;
		// && (Keys.currentKeyPressed && Keys.currentKeyPressed.name == "down")
		if (this.directions["left"]) {
			this.dx -= this.movementSpeed;
			if (this.dx < - maxSpeed) {
				this.dx = - maxSpeed;
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
			if (this.dy < - maxSpeed) {
				this.dy = - maxSpeed;
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

	}//end of the function getNextPosition

	public setupTank(_pixiObject) {
		this.setupAnimations(_pixiObject.texture, Config.tankAnimations[_pixiObject.tankColour][_pixiObject.tankType], _pixiObject.u);
	}

	public getEnemys() {
		return this.enemyTanks;
	}

	public setEnemys(_enemyTanks: any) {
		this.enemyTanks = _enemyTanks;
	}

	public getBullets() {
		return this.bullets;
	}

	public setBullets(_bullets) {
		this.bullets = _bullets;
	}

	public addBullet() {
		//TODO mana or timedelay
		this.bullets.push(new Bullet(
			this.tileMap,
			{
				stage: this.stage,
				u: this.pixiObject.u,
				texture: this.pixiObject.texture,
				tankOwner: this.tankOwner,
				isMyTank: this.isMyTank,
				x: this.x,
				y: this.y
			},
			this.currentDirection
		));
	}

	public animate() {
		this.getNextPosition();
		this.checkTileMapCollision();
		this.checkObjects();
		this.setPosition(this.xtemp, this.ytemp);

		//Updating depending objects of parent
		//animate bullets
		for (let i = 0; i < this.bullets.length; i++) {
			if (this.bullets[i].isRemovable()) {
				//TODO delete Enemy
				this.bullets[i].safetlyRemove();
				delete this.bullets[i];
				this.bullets.splice(i, 1);
				i--;
			}
			else {
				this.bullets[i].animate();
			}
		}

		//stage children

	}//end of animate function

}