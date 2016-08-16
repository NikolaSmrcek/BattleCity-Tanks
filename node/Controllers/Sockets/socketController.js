var emitter = null;
var sapis = require(global.nodeDirectory + '/Models/Sockets/meta/sapis.js');

exports.init = ( io, _emitter, usersController, gameQueueController, gameController ) => {
    emitter = _emitter;
    //TODO rethink, maybe we will need to set emitter to queueController
    //queueModel =  used for contaning data for queue
    let subscriptionsSapi = require(global.nodeDirectory + '/Sapis/Subscriptions/subscriptions.js');
    let userRelatedSapi = require(global.nodeDirectory + '/Sapis/UserRelated/userRelated.js');
    let queueSapi = require(global.nodeDirectory + '/Sapis/Game/queue.js');
    let gameSapi = require(global.nodeDirectory + '/Sapis/Game/game.js');

    io.on('connection', socket => {
        //handle socket connection end
        socket.on("disconnect", () => {
            //remove from list of online users
        });

        //Sockets when client wants to subscribe or unsubscribe to/from channel
        socket.on(sapis.subscribe, data => subscriptionsSapi[sapis.subscribe]({ socket, data, emitter }));
        socket.on(sapis.unsubscribe, data => subscriptionsSapi[sapis.unsubscribe]({ socket, data, emitter }));

        //userRelated sapis - info, userName etc.
        socket.on(sapis.userName, data => userRelatedSapi[sapis.userName]({ socket, data, emitter, usersController }));

        //queueRelated sapis - joining the queue, accepting queue call
        socket.on(sapis.enterQueue, data => queueSapi[sapis.enterQueue]({ socket, data, emitter, gameQueueController, usersController }));
        socket.on(sapis.acceptQueue, data => queueSapi[sapis.acceptQueue]({ socket, data, emitter, gameQueueController }));

        //game related sapis - moving tanks, shooting, removing tiles.
        socket.on(sapis.gameTankAction, data => gameSapi[sapis.gameTankAction]({ socket, data, emitter, gameController }));
        socket.on(sapis.gameChatMessage, data => gameSapi[sapis.gameChatMessage]({ socket, data, emitter, gameController }));
        socket.on(sapis.gameTankHit, data => gameSapi[sapis.gameTankHit]({ socket, data, emitter, gameController }));
        
        //join each socket to it's own channel
        socket.join(socket.id);
    });
};
