var app, db, io, config;

// Models
// usersModel
var queueModel;


//Controllers
var usersController,
	queueController;

var initModels = () => {
    let QueueModel = require(global.nodeDirectory + '/Models/Queue/queueModel.js');
    //let UsersModel = require(global.nodeDirectory + '/Models/Users/usersModel.js');

    queueModel = new QueueModel();
    //usersModel = new UsersModel();
};

var initControllers = () => {
	let UsersController = require(global.nodeDirectory + '/Controllers/Users/usersController.js');
	let QueueController = require(global.nodeDirectory + '/Controllers/Queue/queueController.js');

	queueController = new QueueController(queueModel);
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
    require(`${global.nodeDirectory}/Controllers/Sockets/socketController.js`).init({ io, usersController, queueController });
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
