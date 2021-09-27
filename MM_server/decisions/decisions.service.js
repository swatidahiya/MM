const db = require('../db');
const Decision = db.Decision;

module.exports = {
   postDecision,
   getDecisions,
   getDecisionByMeetingId,
   filterDecision,
   getDecisionById,
   updateDecision
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

async function getDecisionById(id){
    const decision = await Decision.findById(id)
    console.log(decision)
    return decision;
}

async function filterDecision(object){
   
    var projectName = object.project_Name;
    var status = object.status;
    var user = object.user;
    var decisions = [];
    let data = await Decision.find({ Status: status });
   
    if(data.length > 0) {
        if(projectName === undefined && user === undefined) {
            console.log("1")
            return data;
        }

        else if(projectName !== undefined && user === undefined){
            console.log("2")
            data.forEach(decision => {
                var name = decision.project_Name;
                if(name.toLowerCase() === projectName) {
                    decisions.push(decision)
                }
            })
            return decisions;
        }

        else if(user !== undefined && projectName === undefined ) {
            console.log("3")
            data.forEach(decision => {
                if(decision.DecisionAssignedTo === user) {
                    decisions.push(decision)
                }
            });
            return decisions;
        }
        else if(projectName !== undefined && projectName !== null) {
            
            // console.log(actions)
            console.log('4')
            data.forEach(decision => {
                var name = decision.project_Name.toLowerCase();
                console.log(name)
                console.log(user)
                console.log("projectName : " , projectName )
                console.log("assignee : " , decision.DecisionAssignedTo)
                if(name === projectName && decision.DecisionAssignedTo === user) {
                    console.log("inside if")
                    decisions.push(decision)
                }
            })
            return decisions;
        }
        
    }
    else {
        console.log('5')
        return null;
    }

}

async function updateDecision(id, object) {
    const decision = await Decision.findById(id)
    Object.assign(decision, object);
    await decision.save();
    return decision;
}
