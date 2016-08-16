var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');

global.nodeDirectory = __dirname + '/node';

var config = require('./node/config');
//setting up express
var app = setupExpress();

//Setting up server
var http = require('http');
var server = http.createServer(app);
//Setting up io
var io = setupIO(server);
var db = connectToDataBase();

checkDbConnection();

//Init models, routes and Controllers
require(global.nodeDirectory + '/init.js').init(app, db, io, config);

function checkDbConnection() {
    if (typeof db === "string") {
        console.log(db);
        process.exit(1);
    }
    db.open(err => {
        if (err) {
            console.log("Unable to connect to database: ", err);
            process.exit(1);
        }
    });

    db.on("close", function(e) {
        console.log("process die because mongo connection closed: ", e);
        process.exit(1);
    });
}

function connectToDataBase() {
    if (!config.mongoHost || !config.mongoPort) return "Mongoport or mongoHost missing for database connection";
    return new mongo.Db(config.mongoDBname, new mongo.Server(config.mongoHost, config.mongoPort || 27017, { auto_reconnect: true, poolSize: 15 }), { native_parser: false, safe: true });
}

function setupExpress() {
    let app = express();
    app.use('/scripts', express.static(__dirname + '/node_modules/'));
    //app.use('/thirdParty', express.static(__dirname + ''));
    app.use('/templates', express.static(__dirname + '/views/templates/'));
    app.use('/root', express.static(__dirname));
    app.use(logger('dev'));
    app.use(bodyParser.json({ limit: 524288000 }));
    app.use(bodyParser.urlencoded({ extended: true, limit: 524288000 }));
    app.use(cookieParser());
    //app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname)));

    return app;
}

function setupIO(server) {
    let io = require('socket.io').listen(server);
    server.listen(config.nodePort);
    io.set("origins", "*:*");
    io.set('log level', 0);
    io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'polling']);
    if (config.redisService && config.redisService.enabled) {
        var socketIoRedis = require('socket.io-redis');
        io.adapter(socketIoRedis({ "host": config.redisService.host, "port": config.redisService.port }));
    }
    return io;
}

module.exports = app;
