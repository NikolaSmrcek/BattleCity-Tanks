import { Config } from '../Config/Config';
declare var PIXI: any;
export class Tile {

	private pixiSprite: any = null; //PixiSprite

	private stage: any = null; //stage - scene which holds the game
	private x: number = 0;
	private y: number = 0;
	private tileData: any = null;
	public mapRow: number = 0;
	public mapColumn: number = 0;

	/*
	private blocking: boolean = true;
	private removable: boolean = false;
	private type: any = null; //tip Tile-a
	public key: string = null;
	*/
	constructor(_stage, tileData, _x, _y, mapRow: number, mapColumn: number) {

		this.mapRow = mapRow;
		this.mapColumn = mapColumn;
		this.x = _x;
		this.y = _y;
		this.stage = _stage;
		/*
		this.type = tileData.type;
		this.key = tileData.key;
		this.blocking = tileData.blocking;
		this.removable = tileData.removable;
		*/
		if (tileData.pixiSpriteTexture) {
			this.pixiSprite = new PIXI.Sprite(tileData.pixiSpriteTexture);
			this.pixiSprite.position.set(this.x, this.y);
			//this.pixiSprite.scale.set(Config.imageScale);
			this.addImageToStage();
			/*
			let graphics = new PIXI.Graphics();
			graphics.lineStyle(1, 0xFF0000);
			graphics.drawRect(this.x, this.y, 8, 8);
			this.stage.addChild(graphics);
			*/
		}
		//TODO check if this is potentional memory throtteling
		//delete tileData.pixiSpriteTexture;
		this.tileData = tileData.tileData;
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
		return this.tileData.type;
	}

	public isBlocking() {
		//console.log("Tile data: ", this.tileData);
		return (this.tileData !== null && typeof this.tileData !== "undefined") ? this.tileData.blocking : true;
	}

	public isRemovable() {
		return (this.tileData !== null && typeof this.tileData !== "undefined") ? this.tileData.removable : true;
	}

	public isBulletBlocking(){
		return (this.tileData !== null && typeof this.tileData !== "undefined") ? this.tileData.bulletBlocking : true;
	}

	public destroyTile() {
		this.removeImageFromStage();
		this.pixiSprite = null;
		this.tileData = null;
		this.stage = null;
		delete this;
	}

}