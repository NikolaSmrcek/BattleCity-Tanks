/**
 * Created by nikola on 4/29/16.
 */
import { Component, ElementRef } from '@angular/core';
import { TileMap } from './Tiles/TileMap';
import { Config } from './Config/Config';
import { Keys } from './Handlers/Keys';
import { Tank } from './Entity/Tank';
declare var PIXI: any;
declare var io: any;
declare var SpriteUtilities: any;

@Component({
    selector: 'proba',
    template: ''
})

export class GameComponent {

    //TODO reorganize code below

    public renderer: any = null;
    public stage: any = null;
    public socket: any = null;
    public element: any = null;
    public u: any = null;

    public tileMap: any = null;
    public myTank: any = null;


    constructor(public _element: ElementRef) {
        //TODO reorganize
        this.renderer = PIXI.autoDetectRenderer(Config.gameWidth, Config.gameHeight, { backgroundColor: Config.gameBackgroundColour });
        this.stage = new PIXI.Container();
        this.u = new SpriteUtilities(PIXI);
        this.element = _element;
        this.socket = io('http://localhost:8000');
        //0x1099bb

        PIXI.loader.add('gameTileSet', '/public/assets/game/images/gameTileSet.png').load(this.onAssetsLoaded.bind(this));

    }

    onAssetsLoaded(loader, resources) {
        //it was this.element had to change it cause this is promise asyinkronius funciton
        this.element.nativeElement.appendChild((this.renderer.view));

        this.tileMap = new TileMap(this.stage, this.u);
        this.tileMap.loadTiles(resources.gameTileSet.texture);
        this.tileMap.loadMap(""); //TODO get map from socket

        this.tileMap.isTileBlocking(73,75);

        this.myTank = new Tank(this.tileMap, {
            stage: this.stage,
            texture: resources.gameTileSet.texture,
            u: this.u,
            tankColour: "green",
            tankType: "small",
            tankOwner: "kanta",
            isMyTank: true,
            x: 250,
            y: 450
        }, "right");

        this.setupSockets();
        this.registerKeyBoard();
        this.animate();
    }

    setupSockets() {
        this.socket.on('priceUpdate', function(data) {

        }.bind(this));
    }

    registerKeyBoard() {
        let keys = Config.keyboard;
        for (let key in Config.keyboard) {
            let keyProps = Config.keyboard[key];
            console.log("Key: ", key, " type: ", typeof key);
            switch (keyProps.action) {
                case "right":
                case "up":
                case "down":
                case "left":
                    Keys.keyboard(parseInt(key, 10));
                    Keys.keys[key].press = () => {
                        //TODO TEST + add socket emit
                        //console.log("Key for changing direction pressed");
                        this.myTank.setDirection(keyProps.action);
                    };
                    Keys.keys[key].release = () => {
                        //console.log("Key release.");
                    };
                    break;
                case "shoot":
                    Keys.keyboard(parseInt(key, 10));
                    Keys.keys[key].press = () => {
                        //TODO TEST + add socket emit + action for shooting
                        console.log("PEW PEW PEW");      
                    };
                    Keys.keys[key].release = () => {
                        //console.log("Key release.");
                    };
                    break;
                default: console.log("Unkown action: ", keyProps.action, " for ASCII key: ", key);
            }

        }
    }

    animate() {
        //this.animate.bind(this) jer callback izgubi referencu
        requestAnimationFrame(this.animate.bind(this));

        // just for fun, let's rotate mr rabbit a little
        this.myTank.animate();
        // this.tank.walkUp.rotation += 0.01;

        // render the container
        this.renderer.render(this.stage);
    }

}