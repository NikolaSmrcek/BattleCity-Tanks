var emitter = null;
var sapis = require(global.nodeDirectory + '/Models/Sockets/meta/sapis.js');

exports.init = ( io, _emitter, usersController, gameQueueController ) => {
    emitter = _emitter;
    //TODO rethink, maybe we will need to set emitter to queueController
    //queueModel =  used for contaning data for queue
    let subscriptionsSapi = require(global.nodeDirectory + '/Sapis/Subscriptions/subscriptions.js');
    let userRelatedSapi = require(global.nodeDirectory + '/Sapis/UserRelated/userRelated.js');
    let queueSapi = require(global.nodeDirectory + '/Sapis/Game/queue.js');

    io.on('connection', socket => {
        socket.emit('priceUpdate', 3);
        socket.on('bid', (data) => {
            //send to all clients
            socket.emit('priceUpdate', 3);
            //to all clients except newly created (not to yourself)
            socket.broadcast.emit('priceUpdate', 3);
        });
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

        //join each socket to it's own channel
        socket.join(socket.id);
    });
};
