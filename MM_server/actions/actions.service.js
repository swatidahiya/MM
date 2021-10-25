const db = require('../db');
const Action = db.Action;

module.exports = {
   postAction,
   getActions,
   getActionByMeetingId,
   filterActions,
   getActionById,
   updateAction
}

async function postAction(actionParam){
    const action = new Action(actionParam)

    const actions = await getActions();

    if(actions.length > 0) {
        action.ActionItemID = actions[0].ActionItemID + 1;
    }
    else {
        action.ActionItemID = 1
    }
    await action.save();
}

async function getActions(){
    const actions = await Action.find().sort({ ActionItemID: -1 });
    return actions;
}

async function getActionByMeetingId(id){
    const action = await Action.find({MeetingID : id})
    return action;
}

async function getActionById(id){
    const action = await Action.findById(id)
    return action;
}

async function filterActions(object){

    var projectName = object.project_Name;
    var status = object.status;
    var user = object.user;
    var actions = [];
    let data = await Action.find({ Status: status });
   
    if(data.length > 0) {
        if(projectName === undefined && user === undefined) {
            console.log("1")
            return data;
        }

        else if(projectName !== undefined && user === undefined){
            console.log("2")
            data.forEach(action => {
                var name = action.project_Name;
                if(name.toLowerCase() === projectName) {
                    actions.push(action)
                }
            })
            return actions;
        }

        else if(user !== undefined && projectName === undefined ) {
            console.log("3")
            data.forEach(action => {
                if(action.ActionAssignedTo === user) {
                    actions.push(action)
                }
            });
            return actions;
        }
        else if(projectName !== undefined && projectName !== null) {
            
            console.log('4')
            data.forEach(action => {
                var name = action.project_Name.toLowerCase();
                if(name === projectName && action.ActionAssignedTo === user) {
                    actions.push(action)
                }
            })
            return actions;
        }
        
    }
    else {
        console.log('5')
        return null;
    }

}

async function updateAction(id, object) {
    const action = await Action.findById(id)
    Object.assign(action, object);
    await action.save();
    return action;
}