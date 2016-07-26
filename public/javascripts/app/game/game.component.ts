/**
 * Created by nikola on 4/29/16.
 */
import { Component, ElementRef } from '@angular/core';
import { TileMap } from './Tiles/TileMap';
import { Config } from './Config/Config';
import { Keys } from './Handlers/Keys';
declare var PIXI: any;
declare var io: any;
declare var SpriteUtilities: any;

@Component({
    selector: 'proba',
    template: ''
})

export class GameComponent {

    //TODO reorganize code below

    renderer = null;
    stage = null;
    texture = null;
    bunny = null;
    socket = null;
    tank = null;
    element = null;

    tileMap = null;

    constructor(public _element: ElementRef) {
        //TODO reorganize
        this.renderer = null;
        this.stage = null;
        this.texture = null;
        this.bunny = null;
        this.element = _element;
        this.socket = io('http://localhost:8000');
        //0x1099bb

        PIXI.loader.add('gameTileSet', '/public/assets/game/images/gameTileSet.png').load(this.onAssetsLoaded.bind(this));

    }

    onAssetsLoaded(loader, resources) {
        this.tank = {};

        this.renderer = PIXI.autoDetectRenderer(Config.gameWidth, Config.gameHeight, { backgroundColor: Config.gameBackgroundColour });

        //adding game to custom selector 

        //document.body.appendChild(this.renderer.view);

        //it was this.element had to change it cause this is promise asyinkronius funciton
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

        this.setBunny(this.bunny);
        this.stage.addChild(this.bunny);


        var u = new SpriteUtilities(PIXI);

        //this.tank.walkLeft this.tank.walkUp
        //resources.gameTileSet.textures
        var textures = u.frames(resources.gameTileSet.texture,
            [[0, 0], [16, 0]],
            16, 16
        );

        var textures2 = u.frames(resources.gameTileSet.texture,
            [[32, 0], [48, 0]],
            16, 16
        );

        this.tileMap = new TileMap(this.stage, u);
        this.tileMap.loadTiles(resources.gameTileSet.texture);
        this.tileMap.loadMap("");

        //this.tank.walkUp = u.sprite(textures);
        this.tank.walkUp = textures;
        this.tank.walkUp = new PIXI.extras.MovieClip(this.tank.walkUp);

        this.tank.walkUp.position.set(150);
        this.tank.walkUp.anchor.set(0.5);
        this.tank.walkUp.animationSpeed = 0.5;

        this.tank.walkLeft = textures2;
        this.tank.walkLeft = new PIXI.extras.MovieClip(this.tank.walkLeft);

        this.tank.walkLeft.position.set(150);
        this.tank.walkLeft.anchor.set(0.5);
        this.tank.walkLeft.animationSpeed = 0.5;

        //this.tank.walkUp.play();

        this.tank.currentAnimation = this.tank.walkUp;
        this.tank.currentAnimation.play();

        this.tank.walkLeft.visible = false;

        this.tank.walkUp.animationNameString = "walkUp";
        this.tank.walkLeft.animationNameString = "walkLeft";
        this.tank.walkUp.scale.set(2); //skaliranje slike
        this.tank.walkLeft.scale.set(2); //sklairanje slike (tenka)

        this.setTank(this.tank);
        this.stage.addChild(this.tank.currentAnimation);
        this.stage.addChild(this.tank.walkLeft);

        this.setupSockets();
        this.animate();
    }

    changePosition(newPos) {
        this.bunny.position.x = newPos;
        //primjer kako promjenit animaciju
        this.tank.currentAnimation.visible = false;
        this.tank.currentAnimation.stop();
        
        this.tank.walkLeft.visible = true;
        this.tank.currentAnimation = this.tank.walkLeft;
        this.tank.currentAnimation.play();
    }

    setupSockets() {
        this.socket.on('priceUpdate', function(data) {
            this.changePosition(data);
        }.bind(this));
    }

    animate() {
        //this.animate.bind(this) jer callback izgubi referencu
        requestAnimationFrame(this.animate.bind(this));

        // just for fun, let's rotate mr rabbit a little
        this.bunny.rotation += 0.1;
        // this.tank.walkUp.rotation += 0.01;

        // render the container
        this.renderer.render(this.stage);
    }

    setTank(_tank) {
        this.tank = _tank;
    }
    setBunny(_bunny) {
        this.bunny = _bunny;
    }

}