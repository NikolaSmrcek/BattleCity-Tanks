import {Component} from '@angular/core';
import {SocketController} from '../sockets/socketController';
import {GameComponent} from '../game/game.component';

import {GameScore} from './gameScreen/gameScore.component';

import {Router} from '@angular/router';

import {KeyBoardConfigComponent} from './keyboard/keyboardConfig.component';
//imported component we added as Directive so it we can shot it's content in the templateURL


@Component({
    selector: 'battleCity-mainMenu',
    templateUrl: 'templates/mainMenu.html',
    directives: [KeyBoardConfigComponent]
})

export class MainMenuComponent {

    public isValid: boolean = true;

    constructor(private router: Router) {
    }

    sendQueueRequest() {
        //TODO disable button find Game, if in queue
        this.isValid = false;
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

        SocketController.registerSocket('gameInformation', (data) => {
            console.log("received gameInformation.");
            GameComponent.mapName = data.mapName;
            GameComponent.mapTiles = data.mapTiles;
            GameComponent.tanks = data.tanks;

            GameScore.tanks = data.tanks;
            GameScore.mapName = data.mapName;

            GameScore.gameDuration = data.gameDuration;
            GameScore.gameWinningScore = data.gameWinningScore;

            this.router.navigateByUrl("/game");
        });


    }

}
