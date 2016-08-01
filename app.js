var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

global.nodeDirectory = __dirname + '/node';

var config = require('./node/config');
//setting up express
var app = setupExpress();

//Setting up server
var http = require('http');
var server = http.createServer(app);
//Setting up io
var io = setupIO(server);

//Init models, routes and Controllers
require(global.nodeDirectory+'/init.js').init(app,null,io, config);


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
    io.set('log level', 1);
    io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'polling']);
    if (config.redisService && config.redisService.enabled) {
        var socketIoRedis = require('socket.io-redis');
        io.adapter(socketIoRedis({ "host": config.redisService.host, "port": config.redisService.port }));
    }
    return io;
}

module.exports = app;
