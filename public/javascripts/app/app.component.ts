import {Component} from '@angular/core';
declare var io: any;


@Component({
    selector: 'auction-app',
    templateUrl: 'templates/product.html'
})

export class AppComponent {
    price: number = 0.0;
    socket = null;
    bidValue = '';

    constructor() {
        this.socket = io('http://localhost:8000');
        this.socket.on('priceUpdate', function(data) {
            this.price = data;
        }.bind(this));

        //TODO remove below lines, only for testing
        this.socket.emit('userName', { userName: "kanta2323"+Math.floor((Math.random() * 100) + 1) });
        setTimeout(() => {
            this.socket.emit('enterQueue', { userName: "kanta2323" });
        }, 100);

        setInterval(()=> {
            console.log("TRying to enter queue");
            this.socket.emit('enterQueue', { userName: "kanta2323" });
        },1000*10);
    }

    bid() {
        this.socket.emit('bid', this.bidValue);

        /*
        setTimeout(() => {
            this.socket.emit('userName', { userName: "kanta2323" });
        }, 500);
        */
        this.bidValue = '';
    }
}