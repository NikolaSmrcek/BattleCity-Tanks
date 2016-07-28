import { MapObject } from './MapObject';
import { Config } from '../Config/Config';
import { Keys } from '../Handlers/Keys';

declare var PIXI:any;

export class Tank extends MapObject {

	public tankOwner: string = "";
	public tankColour: string = "";
	public tankType: string = "";
	public isMyTank: boolean = false;

	//pixiObject must have a texture, tankColour, tankType, tankOwner and isMyTank and SpriteUtilites as u
	//pixiObject has initial x and y coordinates, stage od the pixi gameAlso
	constructor(_tileMap: any, pixiObject: any, _direction: string) {
		super(_tileMap, pixiObject);

		this.tankOwner = pixiObject.tankOwner || "";
		this.tankColour = pixiObject.tankColour;
		this.tankType = pixiObject.tankType;
		this.isMyTank = pixiObject.isMyTank || false;

		this.cwidth = Config.entityTileSize * Config.imageScale; //TODO check if * imageScale is neccesary
		this.cheight = Config.entityTileSize * Config.imageScale;


		//TODO TEST
		this.movementSpeed = 2;
		this.maxMovementSpeed = 2;
		this.slowingSpeed = 1;

		this.setupTank(pixiObject);
		this.setDirection(_direction);
	}

	//smoothing the movement
	private getNextPosition() {
		//TODO check if it works
		if (this.isMyTank && !Keys.isSomeKeyPressed) {
			this.dx = 0;
			this.dy = 0;
			return;
		}
		let maxSpeed = this.maxMovementSpeed;

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
		let tankFrameCoordinates = Config.tankAnimations[_pixiObject.tankColour][_pixiObject.tankType],
			u = _pixiObject.u,
			texture = _pixiObject.texture;
		for (let key in tankFrameCoordinates) {
			let textures = u.frames(texture,
				tankFrameCoordinates[key],
				this.entityTileSize, this.entityTileSize
			);
			this.animations[key] = new PIXI.extras.MovieClip(textures);
			this.animations[key].anchor.set(0.5); //TODO change this to configuration
			this.animations[key].animationSpeed = 0.5; //TODO change this to configuration
			this.animations[key].visible = false;
			this.animations[key].position.set(this.x, this.y);
			this.animations[key].scale.set(this.imageScale);
			this.stage.addChild(this.animations[key]);
		}

	}

	public animate() {
		this.getNextPosition();
		this.checkTileMapCollision();
		this.setPosition(this.xtemp, this.ytemp);
	}

}