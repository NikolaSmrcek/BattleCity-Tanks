const sapis = {
	//subscribe - unsubscribe to specific channels - TODO could be usefull for spectating game.
	subscribe: 'subscribe',
	unsubscribe: 'unsubscribe',

	//application based
	userName: 'userName',  //used for initial "login" into onlineUsers
	setStatus: 'setStatus',

	//gameQueue based sapis,
	enterQueue: 'enterQueue',
	acceptQueue: 'acceptQueue',

	//game based sapis
	gameTankAction: 'gameTankAction',
	gameChatMessage: 'gameChatMessage',
	gameTankHit: 'gameTankHit'
};

module.exports = sapis;