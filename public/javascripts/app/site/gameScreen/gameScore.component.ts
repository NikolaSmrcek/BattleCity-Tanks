import { Component, ElementRef } from '@angular/core';

import {GameComponent} from '../../game/game.component';
import {SocketController} from '../../sockets/socketController';


@Component({
    selector: 'battleCity-gameScore',
    templateUrl: 'templates/gameScreen/gameScore.html',
    styleUrls: ['public/stylesheets/gameScreen/gameScore.component.css']//looking from the nodejs point of view
    //directives: [GameComponent] 
})

export class GameScore {

    public static tanks: any = {};
    public static mapName: string = "";

    public myTank: any = {};
    public enemyTanks: any = [];

    public userName: string = "";
    public rulesColor: string = "white";

    public static gameWinningScore: any = 0;
    public static gameDuration: any = 0;

    public _gameWinningScore: any = 0;
    public _gameDuration: any = 0;

    constructor() {
        this.enemyTanks = new Array();
        this.userName = GameComponent.userName;
        this.registerTanks(GameScore.tanks);
        this.registerSockets();
        this._gameInterval();
        this._gameWinningScore = GameScore.gameWinningScore;
        this._gameDuration = GameScore.gameDuration;
    }

    registerTanks(tanks) {
        for (let i = 0; i < tanks.length; i++) {
            tanks[i].score = 0;
            if (tanks[i].tankOwner === this.userName) {
                this.myTank = tanks[i];
            }
            else {
                this.enemyTanks.push(tanks[i]);
            }
        }
    }

    registerSockets() {
        SocketController.registerSocket('gameScore', (data) => {
            console.log("received gameScore.");
            //console.log(data);
            for (let index in data) {
                let currentTank = data[index];
                let tank = this._getTank(currentTank.tankOwner);
                tank.score = currentTank.score;
            }
            //TODO score
        });
    }

    _getTank(tankOwner) {
        let tank = null;
        if (tankOwner === this.userName) {
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

    _gameInterval() {
        setInterval(() => {
            if (this._gameDuration > 0 && !GameComponent.gameOver) {
                this._gameDuration -= 1;
            }
        }, 1000);
    }

}

