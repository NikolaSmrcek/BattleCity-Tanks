import { Component, ElementRef } from '@angular/core';

import { GameComponent } from '../../game/game.component';
import { GameChat } from './gameChat.component';
import { GameScore } from './gameScore.component';

import { SocketController } from '../../sockets/socketController';
import {Router} from '@angular/router';

@Component({
    selector: 'battleCity-gameScreen',
    templateUrl: 'templates/gameScreen/gameScreen.html',
    directives: [GameComponent, GameChat, GameScore]
})

export class GameScreen {

	public alerted: boolean = false;

	constructor(private router: Router) {
		this.alerted = false;
		this.registerSockets();
	}

	registerSockets() {
		SocketController.registerSocket("gameOver", (data) => {
			GameComponent.gameOver = true;
			SocketController.emit("setStatus", { status: "online" });
			if (!this.alerted) {
				this.alerted = true;
				alert("GAME OVER! Thanks for play BattleCiry Tanks alpha. After this you will be routed to the mainMenu!");
				this.router.navigateByUrl("");
			}
		});
	}

}