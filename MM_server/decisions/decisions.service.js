const db = require('../db');
const Decision = db.Decision;

module.exports = {
   postDecision,
   getDecisions,
   getDecisionByMeetingId
}

async function postDecision(decisionParam){
    const decision = new Decision(decisionParam)
    console.log(decision)
    await decision.save();
}

async function getDecisions(){
    const decisions = await Decision.find();
    console.log(decisions)
    return decisions;
}

async function getDecisionByMeetingId(id){
    const decision = await Decision.find({MeetingID : id})
    console.log(decision)
    return decision;
}