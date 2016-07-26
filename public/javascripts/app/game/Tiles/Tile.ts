import { Config } from '../Config/Config';
declare var PIXI: any;
export class Tile {

	private pixiSprite: any = null; //PixiSprite
	private type: any = null; //tip Tile-a
	private stage: any = null; //stage - scene which holds the game
	private x: number = 0;
	private y: number = 0;
	private blocking: boolean = true;

	constructor(_stage, tileData, _x, _y) {

		this.x = _x;
		this.y = _y;
		this.type = tileData.type;
		this.stage = _stage;
		this.blocking = tileData.blocking;
		if (tileData.pixiSpriteTexture) {
			this.pixiSprite = new PIXI.Sprite(tileData.pixiSpriteTexture);
			this.pixiSprite.position.set(this.x, this.y);
			//this.pixiSprite.scale.set(Config.imageScale);
			this.addImageToStage();
		}
	}

	private addImageToStage() {
		if (this.pixiSprite) this.stage.addChild(this.pixiSprite);
	}

	public removeImageFromStage() {
		if (this.pixiSprite) this.stage.removeChild(this.pixiSprite);
	}

	public getImage() {
		return this.pixiSprite;
	}

	public getType() {
		return this.type;
	}

	public isBlocking(){
		return this.blocking;
	}

	public destroyTile() {
		this.removeImageFromStage();
		this.pixiSprite = null;
		this.type = null;
		delete this;
	}

}