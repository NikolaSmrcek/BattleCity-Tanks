//TODO move this to the database
const config = {
    nodePort: 8000,
    maxQueueDodges: 5,
    queueInterval: 100,
    queueMemberWaiting: 10,
    maxGameMembers: 4,
    minGameMembers: 2,
    queueInviteWaitingTime: 1000 * 10,
    playerDodgeQueueInterval: 1000 * 60 * 10
};

module.exports = config;