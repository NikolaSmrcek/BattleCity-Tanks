var app, db, io, config;

// Models
// usersModel
var gameQueueModel,
    emitter;


//Controllers
var usersController,
    gameQueueController,
    gameController;

var initModels = () => {
    var SocketEmitter = require(global.nodeDirectory + '/Models/Sockets/Emitter.js');
    emitter = new SocketEmitter(io);

    let GameQueueModel = require(global.nodeDirectory + '/Models/Game/gameQueueModel.js');
    //let UsersModel = require(global.nodeDirectory + '/Models/Users/usersModel.js');

    gameQueueModel = new GameQueueModel();
    //usersModel = new UsersModel();
};

var initControllers = () => {
    let UsersController = require(global.nodeDirectory + '/Controllers/Users/usersController.js');
    let GameQueueController = require(global.nodeDirectory + '/Controllers/Game/gameQueueController.js');
    let GameController = require(global.nodeDirectory + '/Controllers/Game/gameController.js');

    gameController = new GameController(config);
    gameQueueController = new GameQueueController(gameQueueModel, gameController, config, emitter);
    usersController = new UsersController(config);
};


var initRoutes = () => {
    require(global.nodeDirectory + '/Routes/index.js').init({ app });
    //init default 404
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
};

var initSapis = () => {
    require(`${global.nodeDirectory}/Controllers/Sockets/socketController.js`).init( io, emitter, usersController, gameQueueController );
};


exports.init = (_app, _db, _io, _config) => {
    app = _app;
    db = _db;
    io = _io;
    config = _config;
    initModels();
    initControllers();
    initRoutes();
    initSapis();
};
