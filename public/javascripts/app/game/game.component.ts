/**
 * Created by nikola on 4/29/16.
 */
import { Component, ElementRef } from '@angular/core';
import { TileMap } from './Tiles/TileMap';
import { Config } from './Config/Config';
import { Keys } from './Handlers/Keys';
import { Tank } from './Entity/Tank';

import {SocketController} from '../sockets/socketController';

declare var PIXI: any;
declare var SpriteUtilities: any;

@Component({
    selector: 'battleCity-game',
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
    public static gameOver: boolean = false;
    public static userName: string = "kanta";
    public static myTankColour: string = "";
    public static gameId: string = "";

    public static mapName = "";
    public static mapTiles = "";
    public static tanks = new Array();

    public enemyTanks: any = null;

    constructor(public _element: ElementRef) {
        //TODO reorganize
        GameComponent.gameOver = false;
        this.renderer = PIXI.autoDetectRenderer(Config.gameWidth, Config.gameHeight, { backgroundColor: Config.gameBackgroundColour });
        this.stage = new PIXI.Container();
        this.u = new SpriteUtilities(PIXI);
        this.element = _element;
        this.enemyTanks = new Array();
        this.myTank = {};

        //reseting PIXI in memory 
        PIXI.loader.reset();
        PIXI.loader.add('gameTileSet', '/public/assets/game/images/gameTileSet.png').load(this.onAssetsLoaded.bind(this));

    }

    onAssetsLoaded(loader, resources) {
        //it was this.element had to change it cause this is promise asyinkronius funciton
        this.element.nativeElement.appendChild((this.renderer.view));

        this.tileMap = new TileMap(this.stage, this.u);
        this.tileMap.loadTiles(resources.gameTileSet.texture);
        this.tileMap.loadMap(GameComponent.mapTiles); //TODO get map from socket

        this.registerTanks(GameComponent.tanks, resources.gameTileSet.texture);

        //TODO removeIdle on first socket for each tank

        //Registrating keyboard movements for game
        this.registerKeyBoard();

        //REgistrating sockets
        this.registerSockets();
        //Pixi game loop
        this.animate();
    }


    registerTanks(tanks: any, texture: any) {
        if (!tanks || !texture) return console.log("Tanks array is empty.");
        for (let i = 0; i < tanks.length; i++) {
            if (tanks[i].tankOwner === GameComponent.userName) {
                this.myTank = new Tank(this.tileMap, {
                    stage: this.stage,
                    texture: texture,
                    u: this.u,
                    tankColour: tanks[i].tankColour,
                    tankType: tanks[i].tankType,
                    tankOwner: tanks[i].tankOwner,
                    isMyTank: true,
                    x: tanks[i].x,
                    y: tanks[i].y,
                    gameId: GameComponent.gameId
                }, tanks[i].direction);
                GameComponent.myTankColour = tanks[i].tankColour;
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
                        isMyTank: false,
                        x: tanks[i].x,
                        y: tanks[i].y,
                        gameId: GameComponent.gameId
                    }, tanks[i].direction)
                );
            }
        } //end of for loop determing enemies and my tank

        this.myTank.setEnemys(this.enemyTanks);

        for (let j = 0; j < this.enemyTanks.length; j++) {
            let enemyTanksArray = new Array();
            for (let k = 0; k < this.enemyTanks.length; k++) {
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
                        //this.myTank.setDirection(keyProps.action);
                        SocketController.emit("gameTankAction", { tankOwner: GameComponent.userName, gameId: GameComponent.gameId, value: keyProps.action, action: "direction" });
                    };
                    Keys.keys[keyProps.keyCode].release = () => {
                        SocketController.emit("gameTankAction", { tankOwner: GameComponent.userName, gameId: GameComponent.gameId, value: {}, action: "idle" });

                    };
                    break;
                case "shoot":
                    Keys.keyboard(keyProps);
                    Keys.keys[keyProps.keyCode].press = () => {
                        //TODO TEST + add socket emit + action for shooting
                        //this.myTank.addBullet();
                        SocketController.emit("gameTankAction", { tankOwner: GameComponent.userName, gameId: GameComponent.gameId, action: "shoot", value: {} });

                    };
                    Keys.keys[keyProps.keyCode].release = () => {
                        SocketController.emit("gameTankAction", { tankOwner: GameComponent.userName, gameId: GameComponent.gameId, action: "shootStop", value: {} });
                    };
                    break;
                default: console.log("Unkown action: ", keyProps.action, " for ASCII key: ", keyProps.keyCode);
            }

        }
        Keys.isInGame = true;
    }

    registerSockets() {
        SocketController.registerSocket("gameTankAction", (data) => {
            if (!data.tankOwner || !data.gameId || !data.action) return console.log("Missing data");
            if (data.gameId !== GameComponent.gameId) return console.log("Non matching gameId");
            let tank = this._getTank(data.tankOwner);
            if (tank === null) return console.log("Could not determine tank by tankOwner.");
            switch (data.action) {
                case "direction":
                    tank.removeIdle();
                    tank.setDirection(data.value);
                    break;
                case "shoot":
                    tank.setShooting();
                    tank.addBullet();
                    break;
                case "shootStop":
                    tank.removeShooting();
                    break;
                case "idle":
                    tank.setIdle();
                    break;
                default:
                    console.log("Unknown action sent, action: " + data.action);
            }

        });
        /*
        SocketController.registerSocket('gameScore', (data) => {
            console.log("received gameScore.");
            //console.log(data);
            for(let index in data){
                let currentTank = data[index];
                let tank = this._getTank(currentTank.tankOwner);
                tank.score = currentTank.score;
            }
            //TODO score
        });
        */

    }

    _getTank(tankOwner) {
        let tank = null;
        if (tankOwner === GameComponent.userName) {
            tank = this.myTank;
        }
        else {
            for (let j = 0; j < this.enemyTanks.length; j++) {
                if (this.enemyTanks[j].tankOwner === tankOwner) {
                    tank = this.enemyTanks[j];
                }
            }
        }
        return tank;
    }

    animate() {
        //this.animate.bind(this) jer callback izgubi referencu
        requestAnimationFrame(this.animate.bind(this));

        if (!GameComponent.gameOver) {
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