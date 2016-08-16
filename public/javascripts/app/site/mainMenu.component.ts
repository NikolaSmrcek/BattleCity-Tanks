import {Component} from '@angular/core';
import {SocketController} from '../sockets/socketController';
import {GameComponent} from '../game/game.component';

import {Router} from '@angular/router';

import {KeyBoardConfigComponent} from './keyboard/keyboardConfig.component';
//imported component we added as Directive so it we can shot it's content in the templateURL


@Component({
    selector: 'battleCity-mainMenu',
    templateUrl: 'templates/mainMenu.html',
    directives: [KeyBoardConfigComponent]
})

export class MainMenuComponent {

    constructor(private router: Router) {
    }

    sendQueueRequest() {
        //TODO send socket signal - enter queue
        //TODO disable button find Game, if in queue
        //this.router.navigateByUrl("/game");đ
        console.log("Clicked play!");
        SocketController.emit('enterQueue', { userName: GameComponent.userName });
        SocketController.registerSocket('gameJoin', (data) => {
            console.log("gameJoin data: ", data);
            GameComponent.gameId = data.gameId;
        });
        SocketController.registerSocket('gameInvite', (data) => {
            console.log("received gameInvite.");
            SocketController.emit("acceptQueue", { answer: true, gameId: GameComponent.gameId });
        });

        SocketController.registerSocket('gameScore', (data) => {
            console.log("received gameScore.");
            console.log(data);
        });

        SocketController.registerSocket('gameInformation', (data) => {
            console.log("received gameInformation.");
            GameComponent.mapName = data.mapName;
            GameComponent.mapTiles = data.mapTiles;
            GameComponent.tanks = data.tanks;
            this.router.navigateByUrl("/game")
        });
    }

}
/*
        SocketController.registerSocket('priceUpdate', (data) => {this.price = data;} );
        //TODO remove below lines, only for testing
        SocketController.emit('userName', { userName: "kanta2323"+Math.floor((Math.random() * 100) + 1) });
           
        setTimeout(() => {
            SocketController.emit('enterQueue', { userName: "kanta2323" });
        }, 100);

        setInterval(()=> {
            console.log("TRying to enter queue");
            SocketController.emit('enterQueue', { userName: "kanta2323" });
        },1000*10);
 */