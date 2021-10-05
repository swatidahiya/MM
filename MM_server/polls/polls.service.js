const db = require('../db');
const Poll = db.Poll;

module.exports = {
   createPoll,
   getAllPoll
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