var sapis = require(global.nodeDirectory + '/Models/Sockets/meta/sapis.js');

exports[sapis.subscribe] = ({ socket, data }) => {
	if(!data && !data.channel) return console.log("Channel not provided for joining.");
	socket.join(data.channel);
};

exports[sapis.unsubscribe] = ({ socket, data }) => {
	if(!data && !data.channel) return console.log("Channel not provided for leaving.");
	socket.leave(data.channel);
};