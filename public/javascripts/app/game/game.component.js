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
                function GameComponent(element) {
                    this.element = element;
                    this.renderer = null;
                    this.stage = null;
                    this.texture = null;
                    this.bunny = null;
                    this.socket = null;
                    this.renderer = null;
                    this.stage = null;
                    this.texture = null;
                    this.bunny = null;
                    this.socket = io('http://localhost:8000');
                    //0x1099bb
                    this.renderer = PIXI.autoDetectRenderer(800, 600, { backgroundColor: 0x000000 });
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
                    this.socket.on('priceUpdate', function (data) {
                        this.changePosition(data);
                    }.bind(this));
                    // start animating
                    this.animate();
                }
                GameComponent.prototype.changePosition = function (newPos) {
                    this.bunny.position.x = newPos;
                };
                GameComponent.prototype.animate = function () {
                    //this.animate.bind(this) jer callback izgubi referencu
                    requestAnimationFrame(this.animate.bind(this));
                    // just for fun, let's rotate mr rabbit a little
                    this.bunny.rotation += 0.1;
                    // render the container
                    this.renderer.render(this.stage);
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