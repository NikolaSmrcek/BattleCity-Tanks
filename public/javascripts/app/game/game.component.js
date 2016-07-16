System.register(['@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var GameComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            GameComponent = (function () {
                function GameComponent(_element) {
                    this._element = _element;
                    this.renderer = null;
                    this.stage = null;
                    this.texture = null;
                    this.bunny = null;
                    this.socket = null;
                    this.tank = null;
                    this.element = null;
                    this.renderer = null;
                    this.stage = null;
                    this.texture = null;
                    this.bunny = null;
                    this.element = _element;
                    this.socket = io('http://localhost:8000');
                    //0x1099bb
                    PIXI.loader.add('gameTileSet', '/public/assets/game/images/gameTileSet.png').load(this.onAssetsLoaded.bind(this));
                }
                GameComponent.prototype.onAssetsLoaded = function (loader, resources) {
                    this.tank = {};
                    this.renderer = PIXI.autoDetectRenderer(800, 600, { backgroundColor: 0x000000 });
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
                    var textures = u.frames(resources.gameTileSet.texture, [[0, 0], [16, 0]], 16, 16);
                    var textures2 = u.frames(resources.gameTileSet.texture, [[32, 0], [48, 0]], 16, 16);
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
                };
                GameComponent.prototype.changePosition = function (newPos) {
                    this.bunny.position.x = newPos;
                    //primjer kako promjenit animaciju
                    this.tank.currentAnimation.visible = false;
                    this.tank.currentAnimation.stop();
                    this.tank.walkLeft.visible = true;
                    this.tank.currentAnimation = this.tank.walkLeft;
                    this.tank.currentAnimation.play();
                };
                GameComponent.prototype.setupSockets = function () {
                    this.socket.on('priceUpdate', function (data) {
                        this.changePosition(data);
                    }.bind(this));
                };
                GameComponent.prototype.animate = function () {
                    //this.animate.bind(this) jer callback izgubi referencu
                    requestAnimationFrame(this.animate.bind(this));
                    // just for fun, let's rotate mr rabbit a little
                    this.bunny.rotation += 0.1;
                    // this.tank.walkUp.rotation += 0.01;
                    // render the container
                    this.renderer.render(this.stage);
                };
                GameComponent.prototype.setTank = function (_tank) {
                    this.tank = _tank;
                };
                GameComponent.prototype.setBunny = function (_bunny) {
                    this.bunny = _bunny;
                };
                GameComponent = __decorate([
                    core_1.Component({
                        selector: 'proba',
                        template: ''
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], GameComponent);
                return GameComponent;
            }());
            exports_1("GameComponent", GameComponent);
        }
    }
});
//# sourceMappingURL=game.component.js.map