import { MapObject } from './MapObject';
import { Config } from '../Config/Config';
import { Keys } from '../Handlers/Keys';
import { Bullet } from './Bullet';

import { SocketController } from '../../sockets/socketController';

declare var PIXI: any;

export class Tank extends MapObject {

	public tankOwner: string = "";
	public tankColour: string = "";
	public tankType: string = "";
	public isMyTank: boolean = false;

	public mana: number = 0;
	public maxMana: number = 0;
	public bulletManaCost: number = 0;

	public healthPoints: number = 0;
	public maximumHealthPoints: number = 0;
	//for disapearing effect
	public flinching: boolean = false;
	public flinchCounter: number = 0;
	public flinchStop: number = 0;

	public spawning: boolean = false;
	public shooting: boolean = false;

	public enemyTanks: any = null;
	public bullets: any = null;

	//TODO change way or place to hold SpriteUtilites and texture
	public pixiObject: any = null;

	private gameId: string = "";

	//pixiObject must have a texture, tankColour, tankType, tankOwner and isMyTank and SpriteUtilites as u
	//pixiObject has initial x and y coordinates, stage od the pixi gameAlso
	constructor(_tileMap: any, pixiObject: any, _direction: string) {
		super(_tileMap, pixiObject);

		this.pixiObject = pixiObject;
		this.initialDirection = _direction;

		this.tankOwner = pixiObject.tankOwner || "";
		this.tankColour = pixiObject.tankColour;
		this.tankType = pixiObject.tankType;
		this.isMyTank = pixiObject.isMyTank || false;

		this.gameId = pixiObject.gameId;

		this.bullets = new Array();

		this.cwidth = Config.entityTileSize * Config.imageScale; //TODO check if * imageScale is neccesary
		this.cheight = Config.entityTileSize * Config.imageScale;

		this.flinchStop = Config.flinchStop;

		//TODO TEST
		this.movementSpeed = 2;
		this.maxMovementSpeed = 2;
		this.slowingSpeed = 1;

		this.setupTank(pixiObject);

	}

	public checkObjects() {
		if (!(this.enemyTanks instanceof Array)) return console.log("Enemy tanks are not array");
		for (let i = 0; i < this.enemyTanks.length; i++) {
			//checking if any of the enemy tanks if colliding with our(my)Tank - if it is we stop the movement of our tank
			if (this.intersects(this.enemyTanks[i])) {
				this.dx = 0;
				this.dy = 0;
				this.xtemp = this.x;
				this.ytemp = this.y;
			}
			//bullet set removable
			for (let j = 0; j < this.bullets.length; j++) {
				//for loop where we check if the bullets collided, if they did just remove them - nothing happens
				for (let k = 0; k < this.enemyTanks[i].bullets.length; k++) {
					if (this.bullets[j].intersects(this.enemyTanks[i].bullets[k])) {
						this.bullets[j].setRemove();
						this.enemyTanks[i].bullets[k].setRemove();
					}
				}
				if (this.bullets[j].intersects(this.enemyTanks[i])) {
					//TODO add explosion animation to tank
					if(this.isMyTank) SocketController.emit("gameTankHit", { tankOwner: this.tankOwner, gameId: this.gameId });
					this.enemyTanks[i].setHit(this.bullets[j].getBulletDamage());
					this.bullets[j].setRemove();
					break;
				}
			}
		} //end of for loop enemyTanks
	}

	public setHit(bulletDamage: number = 1) {
		//TODO notify others on hit
		if (this.flinching) return;
		this.healthPoints -= bulletDamage;
		if (this.healthPoints <= 0 && !this.flinching) {
			//TODO explosion
			this.setAnimation("explosion");
		}
		
	}

	//smoothing the movement
	private getNextPosition() {
		//if (this.idle) return;
		//(this.isMyTank && !Keys.isSomeKeyPressed) || Keys.checkKeyPress("shoot") 
		if (this.idle || this.shooting) {
			this.dx = 0;
			this.dy = 0;
			return;
		}
		let maxSpeed = this.maxMovementSpeed;
		// && (Keys.currentKeyPressed && Keys.currentKeyPressed.name == "down")
		// this.directions["left"]
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

	public spawnTank(x: number = null, y: number = null) {
		//TODO REMOVE this way of working - we will always get from a server side position where we spawned - or we will notify others
		let respawnX = x || this.initialX;
		let respawnY = y || this.initialY;

		this.bulletManaCost = Config.bulletManaCost;
		this.maxMana = Config.maxTankMana;
		this.mana = this.maxMana;

		this.healthPoints = Config.tankHealthPoints;
		this.maximumHealthPoints = Config.maximumTankHealthPoints;

		this.flinching = true;
		this.flinchCounter = 0;
		this.setPosition(respawnX, respawnY);
		this.setAnimation("spawn");
	}

	private checkFlinching() {
		//checking if flicnking and updateing counter
		if (this.flinching) {
			this.flinchCounter++;
			if (this.flinchCounter > this.flinchStop) {
				this.flinching = false;
			}
			//if it is still flinching we are checking shall we display the surroundings or not
			if (this.flinching) {
				if (this.flinchCounter % 10 < 5) {
					//TODO add anohter "white" animation around tank that is constantly on
					this.currentAnimation.visible = false;
				}
				else {
					this.currentAnimation.visible = true;
				}
			}
			else {
				//flinching is over return this tank to visible
				this.currentAnimation.visible = true;
			}
		}
	}

	public setupTank(_pixiObject) {
		this.setupAnimations(_pixiObject.texture, Config.tankAnimations[_pixiObject.tankColour][_pixiObject.tankType], _pixiObject.u);
		this.animations["spawn"].onComplete = () => {
			this.setDirection(this.initialDirection);
		};
		this.animations["explosion"].onComplete = () => {
			this.spawnTank();
		};
		this.spawnTank();
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

	public setShooting() {
		this.shooting = true;
	}

	public removeShooting() {
		this.shooting = false;
	}

	public addBullet() {
		//TODO mana or timedelay
		if (this.mana >= this.bulletManaCost) {
			this.mana -= this.bulletManaCost;
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
				this.bullets[i].safetlyRemove();
				delete this.bullets[i];
				this.bullets.splice(i, 1);
				i--;
			}
			else {
				this.bullets[i].animate();
			}
		}

		//Updejting mana for bullets
		this.mana += Config.manaPerFPS;
		if (this.mana > this.maxMana) this.mana = this.maxMana;
		this.checkFlinching();

	}//end of animate function

}