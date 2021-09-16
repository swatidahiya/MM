const db = require('../db');
const Action = db.Action;

module.exports = {
   postAction,
   getActions,
   getActionByMeetingId
}

async function postAction(actionParam){
    const action = new Action(actionParam)
    console.log(action)
    await action.save();
}

async function getActions(){
    const actions = await Action.find();
    console.log(actions)
    return actions;
}

async function getActionByMeetingId(id){
    const action = await Action.find({MeetingID : id})
    console.log(action)
    return action;
}