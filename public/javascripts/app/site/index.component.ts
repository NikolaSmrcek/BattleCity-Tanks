import {Component} from '@angular/core';

import {ROUTER_DIRECTIVES} from '@angular/router';

import {SocketController} from '../sockets/socketController';
import {GameComponent} from '../game/game.component';

@Component({
    selector: 'battleCity',
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES]
})


export class IndexComponent {

    constructor() {
    	this.getUserName();
    }

    getUserName(){
    	SocketController.emit('userName', { msg:"msg" });
    	SocketController.registerSocket('userName', (data) => {
    		//console.log("userName: ", data);
    		if(data.status = 200) GameComponent.userName = data.userName;
    	} );
    }

}