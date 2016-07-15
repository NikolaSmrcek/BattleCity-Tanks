/**
 * Created by nikola on 4/29/16.
 */
import {Component, ElementRef} from '@angular/core';
declare var PIXI:any;
declare var io:any;

@Component({
    selector: 'proba',
    template: ''
})

export class GameComponent {

    renderer = null;
    stage = null;
    texture = null;
    bunny = null;
    socket = null;

    constructor(public element: ElementRef){
        this.renderer = null;
        this.stage = null;
        this.texture = null;
        this.bunny = null;
        this.socket = io('http://localhost:8000');

        this.renderer = PIXI.autoDetectRenderer(800, 600,{backgroundColor : 0x1099bb});

        //adding game to custom selector 

        //document.body.appendChild(this.renderer.view);
        this.element.nativeElement.appendChild((this.renderer.view));

// create the root of the scene graph
        this.stage = new PIXI.Container();

// create a texture from an image path
        this.texture = PIXI.Texture.fromImage('/public/images/bunny.png');

// create a new Sprite using the texture
        this.bunny = new PIXI.Sprite(this.texture);

// center the sprite's anchor point
        this.bunny.anchor.x = 0.5;
        this.bunny.anchor.y = 0.5;

// move the sprite to the center of the screen
        this.bunny.position.x = 300;
        this.bunny.position.y = 150;

        this.stage.addChild(this.bunny);

        //custom adding socket message behaviour
        /*
        this.socket.on('priceUpdate', function(data){
            this.bunny.position.x = data;
        }).bind(this);
           */
        this.socket.on('priceUpdate', function(data){
           this.changePosition(data);
        }.bind(this));

// start animating
        this.animate();
    }

    changePosition(newPos){
        this.bunny.position.x = newPos;
    }

    animate() {
        //this.animate.bind(this) jer callback izgubi referencu
        requestAnimationFrame(this.animate.bind(this));

        // just for fun, let's rotate mr rabbit a little
            this.bunny.rotation += 0.1;

        // render the container
            this.renderer.render(this.stage);
    }

}