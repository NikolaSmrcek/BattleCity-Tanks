import { Config } from '../Config/Config';
import { MapObject } from './MapObject';
export class Bullet extends MapObject {

	public tankOwner: string = "";
	public isMyTank: boolean = false;

	public hit: boolean = false;
	public remove: boolean = false;

	constructor(_tileMap: any, pixiObject: any, _direction: string) {
		super(_tileMap, pixiObject, null, true);
		this.tankOwner = pixiObject.tankOwner || "";
		this.isMyTank = pixiObject.isMyTank || false;

		this.movementSpeed = 5;

		this.setupBullet(pixiObject);
		this.setDirection(_direction);
		this.calculateVelocity();
	}

	private setupBullet(_pixiObject) {
		this.setupAnimations(_pixiObject.texture, Config.bulletAnimations, _pixiObject.u);
		this.animations["explosion"].onComplete = () => {
			this.setRemove();
		}; //TODO set remove to True
		//console.log("This animations[explosion] bullet: ", this.animations["explosion"]);
	}

	private calculateVelocity() {
		switch (this.currentDirection) {
			case "left":
				this.dx -= this.movementSpeed;
				break;
			case "right":
				this.dx += this.movementSpeed;
				break;
			case "up":
				this.dy -= this.movementSpeed;
				break;
			case "down":
				this.dy += this.movementSpeed;
				break;
			default: console.log("Unknown direction: ", this.currentDirection);
		}
	}

	public isHit() {
		return this.hit;
	}

	public setHit() {
		this.hit = true;
	}

	public isRemovable() {
		return this.remove;
	}

	public setRemove() {
		this.remove = true;
	}

	private checkHit() {
		if (this.dx == 0 && this.dy == 0) {
			this.setHit();
			//TODO remove tile that was hit
			for( let index in this.blockingTiles){
				//console.log("OVO JE BLOCKING tiles: ", this.blockingTiles.length);
				this.removeTileFromMap(this.blockingTiles[index]);
			}
			//this.animations("explosion").onComplete
			//Object removes the maker in our case tank
			this.setAnimation("explosion");
		}
	}

	public animate() {
		this.checkTileMapCollision();
		this.setPosition(this.xtemp, this.ytemp);
		this.checkHit();
	}

}