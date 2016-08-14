import { Component, ElementRef } from '@angular/core';
import { Keys } from '../../game/Handlers/Keys';

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

	}

	ngOnInit() {
		//todo register sockets - for pushing on receive
	}
	send() {
		//TODO SEND SOCKET MESSAGE
		this.conversation.push({ "message": this.message, "color": "red" });
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