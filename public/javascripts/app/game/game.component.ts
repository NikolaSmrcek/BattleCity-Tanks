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

    public enemyTanks: any = null;

    constructor(public _element: ElementRef) {
        //TODO reorganize
        this.renderer = PIXI.autoDetectRenderer(Config.gameWidth, Config.gameHeight, { backgroundColor: Config.gameBackgroundColour });
        this.stage = new PIXI.Container();
        this.u = new SpriteUtilities(PIXI);
        this.element = _element;
        this.enemyTanks = new Array();
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

        //TODO make tanks from data that come from socket

        let tanks = [{ tankColour: "yellow", tankType: "small", tankOwner: "RANDOM", x: 500, y: 500 },
            { tankColour: "grey", tankType: "small", tankOwner: "RANDOM", x: 100, y: 100 },
            { tankColour: "pink", tankType: "small", tankOwner: "RANDOM", x: 300, y: 300 }];

              //let tanks = [{ tankColour: "yellow", tankType: "small", tankOwner: "RANDOM", x: 500, y: 500 }];
        for (let i = 0; i < tanks.length; i++) {
           this.enemyTanks.push(
                new Tank(this.tileMap, {
                    stage: this.stage,
                    texture: resources.gameTileSet.texture,
                    u: this.u,
                    tankColour: tanks[i].tankColour,
                    tankType: tanks[i].tankType,
                    tankOwner: tanks[i].tankOwner + i,
                    isMyTank: false,
                    x: tanks[i].x,
                    y: tanks[i].y
                }, "left")
            );
        }
        this.myTank.setEnemys(this.enemyTanks);


        //Registrating all sockets for game
        this.setupSockets();
        //Registrating keyboard movements for game
        this.registerKeyBoard();
        //Pixi game loop
        this.animate();
    }

    setupSockets() {
        this.socket.on('priceUpdate', function(data) {

        }.bind(this));
    }

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

        this.myTank.animate();

        // render the container
        this.renderer.render(this.stage);
    }

}