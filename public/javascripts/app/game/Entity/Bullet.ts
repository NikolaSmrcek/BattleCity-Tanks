import { Config } from '../Config/Config';
import { MapObject } from './MapObject';
export class Bullet extends MapObject {

	public tankOwner: string = "";
	public isMyTank: boolean = false;

	public hit: boolean = false;
	public remove: boolean = false;

	public bulletDamage: number = 0;

	constructor(_tileMap: any, pixiObject: any, _direction: string) {
		super(_tileMap, pixiObject, null, true);
		this.tankOwner = pixiObject.tankOwner || "";
		this.isMyTank = pixiObject.isMyTank || false;

		this.movementSpeed = 5;
		this.bulletDamage = Config.bulletDamage;

		this.setupBullet(pixiObject);
		this.setDirection(_direction);
		this.calculateVelocity();
	}

	private setupBullet(_pixiObject) {
		this.setupAnimations(_pixiObject.texture, Config.bulletAnimations, _pixiObject.u);
		this.animations["explosion"].onComplete = () => {
			this.setRemove();
		};
		//console.log("This animations[explosion] bullet: ", this.animations["explosion"]);
	}

	protected isTileBlockingWrapper(row, column) {
		let blocking = this.tileMap.isTileBulletBlocking(row, column);
		if (blocking) this.blockingTiles.push(this.tileMap.getTile(row, column));
		return blocking;
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

	public getBulletDamage() {
		return this.bulletDamage;
	}

	public setBulletDamage(bulletDamage: number = 1) {
		this.bulletDamage = bulletDamage;
	}

	public incrementBulletDamage(bulletDamage: number = 1) {
		this.bulletDamage += bulletDamage;
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
			for (let index in this.blockingTiles) {
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