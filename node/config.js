//TODO move this to the database
const config = {
    nodePort: 8000,
    //gameQueue
    maxQueueDodges: 5,
    queueInterval: 100,
    queueMemberWaiting: 10,
    maxGameMembers: 4,
    minGameMembers: 2,
    queueInviteWaitingTime: 1000 * 10,
    playerDodgeQueueInterval: 1000 * 60 * 10,

    //game
    gameWinningScore: 5,

    //mongo
    mongoHost: "localhost",
    mongoPort: parseInt(process.env.MONGO_SERVICE_PORT, 10) || 27017,
    mongoDBname: "BattleCityTanks",
    serviceMode: "direct",
    mongoMapsCollectionName: "gameMaps"
};

module.exports = config;