import {Component} from '@angular/core';
import {SocketController} from './sockets/socketController';

@Component({
    selector: 'auction-app',
    templateUrl: 'templates/product.html'
})

export class AppComponent {
    price: number = 0.0;
    bidValue = '';

    constructor() {
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
    }

    bid() {
        SocketController.emit('bid',this.bidValue);
        this.bidValue = '';
    }
}