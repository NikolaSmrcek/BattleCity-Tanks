import { Component, ElementRef } from '@angular/core';

import { GameComponent } from '../../game/game.component';
import { GameChat } from './gameChat.component';

@Component({
    selector: 'battleCity-gameScreen',
    templateUrl: 'templates/gameScreen/gameScreen.html',
    directives: [GameComponent, GameChat]
})

export class GameScreen{

}