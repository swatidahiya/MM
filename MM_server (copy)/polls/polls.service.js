const db = require('../db');
const Poll = db.Poll;

module.exports = {
   createPoll,
   getAllPoll,
   updatePoll
}

async function createPoll(pollParam){
    const poll = new Poll(pollParam)
    console.log(poll)
    await poll.save();
}

async function getAllPoll(){
    const polls = await Poll.find().select();
    return polls;
}

async function updatePoll(pollParam){
    console.log(pollParam);
    const poll = await Poll.findById(pollParam.id)
    Object.assign(poll, pollParam);
    await poll.save();
    return poll;
}