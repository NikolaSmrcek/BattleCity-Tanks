//TODO move this to the database
const config = {
    nodePort: 8000,
    
    //gameQueue
    maxQueueDodges: 5,
    queueInterval: 100, // miliseconds
    queueMemberWaiting: 10, //seconds
    maxGameMembers: 4,
    minGameMembers: 2,
    queueInviteWaitingTime: 1000 * 10, //1000 ms * number of seconds   - seconds
    playerDodgeQueueInterval: 1000 * 10 * 60 , //1000ms * number of seconds * (transfor to minutes) - minutes

    //game
    gameWinningScore: 5,
    gameDuration: 60 * 5, //seconds * num of minutes
    checkGameOver: 500, 

    //mongo
    mongoHost: "localhost",
    mongoPort: parseInt(process.env.MONGO_SERVICE_PORT, 10) || 27017,
    mongoDBname: "BattleCityTanks",
    serviceMode: "direct",
    mongoMapsCollectionName: "gameMaps"
};

module.exports = config;