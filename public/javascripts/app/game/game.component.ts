/**
 * Created by nikola on 4/29/16.
 */
import { Component, ElementRef } from '@angular/core';
import { TileMap } from './Tiles/TileMap';
import { Config } from './Config/Config';
import { Keys } from './Handlers/Keys';
import { Tank } from './Entity/Tank';
declare var PIXI: any;
declare var SpriteUtilities: any;

@Component({
    selector: 'proba',
    template: ''
})

export class GameComponent {

    //TODO reorganize code below

    public renderer: any = null;
    public stage: any = null;
    public element: any = null;
    public u: any = null;

    public tileMap: any = null;
    public myTank: any = null;

    //TODO  - from socket
    public gameOver: boolean = false;
    public userName: string = "kanta";

    public enemyTanks: any = null;

    constructor(public _element: ElementRef) {
        //TODO reorganize
        this.renderer = PIXI.autoDetectRenderer(Config.gameWidth, Config.gameHeight, { backgroundColor: Config.gameBackgroundColour });
        this.stage = new PIXI.Container();
        this.u = new SpriteUtilities(PIXI);
        this.element = _element;
        this.enemyTanks = new Array();

        PIXI.loader.add('gameTileSet', '/public/assets/game/images/gameTileSet.png').load(this.onAssetsLoaded.bind(this));

    }

    onAssetsLoaded(loader, resources) {
        //it was this.element had to change it cause this is promise asyinkronius funciton
        this.element.nativeElement.appendChild((this.renderer.view));

        this.tileMap = new TileMap(this.stage, this.u);
        this.tileMap.loadTiles(resources.gameTileSet.texture);
        this.tileMap.loadMap(""); //TODO get map from socket

        //TODO make tanks from data that come from socket

        let tanks = [{ tankColour: "yellow", tankType: "small", tankOwner: "RANDOM12", isMyTank: false, x: 500, y: 500, direction: "left" },
            { tankColour: "grey", tankType: "small", tankOwner: "RANDOM2", isMyTank: false, x: 100, y: 100, direction: "left" },
            { tankColour: "pink", tankType: "small", tankOwner: "RANDOM3", isMyTank: false, x: 300, y: 300, direction: "left" },
            { tankColour: "green", tankType: "small", tankOwner: "kanta", isMyTank: true, x: 250, y: 450, direction: "right" }];

        this.registerTanks(tanks, resources.gameTileSet.texture);

        //TODO removeIdle on first socket for each tank

        //Registrating keyboard movements for game
        this.registerKeyBoard();
        //Pixi game loop
        this.animate();
    }


    registerTanks(tanks: any, texture: any) {
        if (!tanks || !texture) return console.log("Tanks array is empty.");
        for (let i = 0; i < tanks.length; i++) {
            if (tanks[i].tankOwner === this.userName) {
                this.myTank = new Tank(this.tileMap, {
                    stage: this.stage,
                    texture: texture,
                    u: this.u,
                    tankColour: tanks[i].tankColour,
                    tankType: tanks[i].tankType,
                    tankOwner: tanks[i].tankOwner,
                    isMyTank: tanks[i].isMyTank,
                    x: tanks[i].x,
                    y: tanks[i].y
                }, tanks[i].direction);
            }
            else {
                this.enemyTanks.push(
                    new Tank(this.tileMap, {
                        stage: this.stage,
                        texture: texture,
                        u: this.u,
                        tankColour: tanks[i].tankColour,
                        tankType: tanks[i].tankType,
                        tankOwner: tanks[i].tankOwner,
                        isMyTank: tanks[i].isMyTank,
                        x: tanks[i].x,
                        y: tanks[i].y
                    }, tanks[i].direction)
                );
            }
        } //end of for loop determing enemies and my tank

        this.myTank.setEnemys(this.enemyTanks);
        this.myTank.removeIdle();

        for (let j = 0; j < this.enemyTanks.length; j++) {
            let enemyTanksArray = new Array();
            for (let k = 0; k < this.enemyTanks.lenght; k++) {
                if (this.enemyTanks[j] === this.enemyTanks[k]) continue;
                enemyTanksArray.push(this.enemyTanks[k]);
            }
            enemyTanksArray.push(this.myTank);
            this.enemyTanks[j].setEnemys(enemyTanksArray);
        } //end of for loop for enemy tanks
    } //end of function registerTanks


    registerKeyBoard() {
        for (let i = 0; i < Config.keyboard.length; i++) {
            let keyProps = Config.keyboard[i];
            console.log("Key: ", keyProps.keyCode, " type: ", typeof keyProps.keyCode);
            switch (keyProps.action) {
                case "right":
                case "up":
                case "down":
                case "left":
                    Keys.keyboard(keyProps);
                    Keys.keys[keyProps.keyCode].press = () => {
                        //TODO TEST + add socket emit
                        //console.log("Key for changing direction pressed");
                        this.myTank.setDirection(keyProps.action);
                    };
                    Keys.keys[keyProps.keyCode].release = () => {
                        //console.log("Key release.");
                    };
                    break;
                case "shoot":
                    Keys.keyboard(keyProps);
                    Keys.keys[keyProps.keyCode].press = () => {
                        //TODO TEST + add socket emit + action for shooting
                        console.log("PEW PEW PEW");
                        this.myTank.addBullet();
                    };
                    Keys.keys[keyProps.keyCode].release = () => {
                        //console.log("Key release.");
                    };
                    break;
                default: console.log("Unkown action: ", keyProps.action, " for ASCII key: ", keyProps.keyCode);
            }

        }
    }

    animate() {
        //this.animate.bind(this) jer callback izgubi referencu
        requestAnimationFrame(this.animate.bind(this));

        if (!this.gameOver) {
            this.myTank.animate();
            //animate other tanks also

            for (let i = 0; i < this.enemyTanks.length; i++) {
                this.enemyTanks[i].animate();
            }

        }
        // render the container
        this.renderer.render(this.stage);
    }

}