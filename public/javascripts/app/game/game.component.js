System.register(['@angular/core', './Tiles/TileMap', './Config/Config', './Handlers/Keys', './Entity/Tank'], function(exports_1, context_1) {
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
    var core_1, TileMap_1, Config_1, Keys_1, Tank_1;
    var GameComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (TileMap_1_1) {
                TileMap_1 = TileMap_1_1;
            },
            function (Config_1_1) {
                Config_1 = Config_1_1;
            },
            function (Keys_1_1) {
                Keys_1 = Keys_1_1;
            },
            function (Tank_1_1) {
                Tank_1 = Tank_1_1;
            }],
        execute: function() {
            GameComponent = (function () {
                function GameComponent(_element) {
                    this._element = _element;
                    //TODO reorganize code below
                    this.renderer = null;
                    this.stage = null;
                    this.socket = null;
                    this.element = null;
                    this.u = null;
                    this.tileMap = null;
                    this.myTank = null;
                    //TODO  - from socket
                    this.gameOver = false;
                    this.userName = "kanta";
                    this.enemyTanks = null;
                    //TODO reorganize
                    this.renderer = PIXI.autoDetectRenderer(Config_1.Config.gameWidth, Config_1.Config.gameHeight, { backgroundColor: Config_1.Config.gameBackgroundColour });
                    this.stage = new PIXI.Container();
                    this.u = new SpriteUtilities(PIXI);
                    this.element = _element;
                    this.enemyTanks = new Array();
                    this.socket = io('http://localhost:8000');
                    //0x1099bb
                    PIXI.loader.add('gameTileSet', '/public/assets/game/images/gameTileSet.png').load(this.onAssetsLoaded.bind(this));
                }
                GameComponent.prototype.onAssetsLoaded = function (loader, resources) {
                    //it was this.element had to change it cause this is promise asyinkronius funciton
                    this.element.nativeElement.appendChild((this.renderer.view));
                    this.tileMap = new TileMap_1.TileMap(this.stage, this.u);
                    this.tileMap.loadTiles(resources.gameTileSet.texture);
                    this.tileMap.loadMap(""); //TODO get map from socket
                    //TODO make tanks from data that come from socket
                    var tanks = [{ tankColour: "yellow", tankType: "small", tankOwner: "RANDOM12", isMyTank: false, x: 500, y: 500, direction: "left" },
                        { tankColour: "grey", tankType: "small", tankOwner: "RANDOM2", isMyTank: false, x: 100, y: 100, direction: "left" },
                        { tankColour: "pink", tankType: "small", tankOwner: "RANDOM3", isMyTank: false, x: 300, y: 300, direction: "left" },
                        { tankColour: "green", tankType: "small", tankOwner: "kanta", isMyTank: true, x: 250, y: 450, direction: "right" }];
                    this.registerTanks(tanks, resources.gameTileSet.texture);
                    //TODO removeIdle on first socket for each tank
                    //Registrating all sockets for game
                    this.setupSockets();
                    //Registrating keyboard movements for game
                    this.registerKeyBoard();
                    //Pixi game loop
                    this.animate();
                };
                GameComponent.prototype.setupSockets = function () {
                    this.socket.on('priceUpdate', function (data) {
                    }.bind(this));
                };
                GameComponent.prototype.registerTanks = function (tanks, texture) {
                    if (!tanks || !texture)
                        return console.log("Tanks array is empty.");
                    for (var i = 0; i < tanks.length; i++) {
                        if (tanks[i].tankOwner === this.userName) {
                            this.myTank = new Tank_1.Tank(this.tileMap, {
                                stage: this.stage,
                                texture: texture,
                                u: this.u,
                                tankColour: tanks[i].tankColour,
                                tankType: tanks[i].tankType,
                                tankOwner: tanks[i].tankOwner,
                                isMyTank: tanks[i].isMyTank,
                                x: tanks[i].x,
                                y: tanks[i].y
                            }, tanks[i].direction);
                        }
                        else {
                            this.enemyTanks.push(new Tank_1.Tank(this.tileMap, {
                                stage: this.stage,
                                texture: texture,
                                u: this.u,
                                tankColour: tanks[i].tankColour,
                                tankType: tanks[i].tankType,
                                tankOwner: tanks[i].tankOwner,
                                isMyTank: tanks[i].isMyTank,
                                x: tanks[i].x,
                                y: tanks[i].y
                            }, tanks[i].direction));
                        }
                    } //end of for loop determing enemies and my tank
                    this.myTank.setEnemys(this.enemyTanks);
                    this.myTank.removeIdle();
                    for (var j = 0; j < this.enemyTanks.length; j++) {
                        var enemyTanksArray = new Array();
                        for (var k = 0; k < this.enemyTanks.lenght; k++) {
                            if (this.enemyTanks[j] === this.enemyTanks[k])
                                continue;
                            enemyTanksArray.push(this.enemyTanks[k]);
                        }
                        enemyTanksArray.push(this.myTank);
                        this.enemyTanks[j].setEnemys(enemyTanksArray);
                    } //end of for loop for enemy tanks
                }; //end of function registerTanks
                GameComponent.prototype.registerKeyBoard = function () {
                    var _this = this;
                    var _loop_1 = function(i) {
                        var keyProps = Config_1.Config.keyboard[i];
                        console.log("Key: ", keyProps.keyCode, " type: ", typeof keyProps.keyCode);
                        switch (keyProps.action) {
                            case "right":
                            case "up":
                            case "down":
                            case "left":
                                Keys_1.Keys.keyboard(keyProps);
                                Keys_1.Keys.keys[keyProps.keyCode].press = function () {
                                    //TODO TEST + add socket emit
                                    //console.log("Key for changing direction pressed");
                                    _this.myTank.setDirection(keyProps.action);
                                };
                                Keys_1.Keys.keys[keyProps.keyCode].release = function () {
                                    //console.log("Key release.");
                                };
                                break;
                            case "shoot":
                                Keys_1.Keys.keyboard(keyProps);
                                Keys_1.Keys.keys[keyProps.keyCode].press = function () {
                                    //TODO TEST + add socket emit + action for shooting
                                    console.log("PEW PEW PEW");
                                    _this.myTank.addBullet();
                                };
                                Keys_1.Keys.keys[keyProps.keyCode].release = function () {
                                    //console.log("Key release.");
                                };
                                break;
                            default: console.log("Unkown action: ", keyProps.action, " for ASCII key: ", keyProps.keyCode);
                        }
                    };
                    for (var i = 0; i < Config_1.Config.keyboard.length; i++) {
                        _loop_1(i);
                    }
                };
                GameComponent.prototype.animate = function () {
                    //this.animate.bind(this) jer callback izgubi referencu
                    requestAnimationFrame(this.animate.bind(this));
                    if (!this.gameOver) {
                        this.myTank.animate();
                        //animate other tanks also
                        for (var i = 0; i < this.enemyTanks.length; i++) {
                            this.enemyTanks[i].animate();
                        }
                    }
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