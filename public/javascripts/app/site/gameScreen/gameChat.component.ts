import { Component, ElementRef } from '@angular/core';
import { Keys } from '../../game/Handlers/Keys';

import { GameComponent } from '../../game/game.component';
import { SocketController } from '../../sockets/socketController';
//TODO import SocketController - emit messages and display messages

@Component({
    selector: 'battleCity-gameChat',
    templateUrl: 'templates/gameScreen/gameChat.html',
    styleUrls: ['public/stylesheets/gameScreen/gameChat.component.css'] //looking from the nodejs point of view
})

export class GameChat {

	public conversation: any = [];
	public message: "";

	constructor() {
		this.conversation = [];
	}

	ngOnInit() {
		this.conversation = [];
		SocketController.registerSocket("gameChatMessage", (data) => {
			this.conversation.push({ "message": data.message, "color": data.color });
		});
	}
	send() {
		SocketController.emit("gameChatMessage", { message: this.message, color: GameComponent.myTankColour, gameId: GameComponent.gameId, tankOwner: GameComponent.userName });
		this.message = "";
	}

	keypressHandler(event) {
        if (event.keyCode === 13) {
            this.send();
        }
    }

    changeKeysInGameFocus(){
    	Keys.isInGame = false;
    }

    changeKeysInGameBlur(){
    	Keys.isInGame = true;
    }

}