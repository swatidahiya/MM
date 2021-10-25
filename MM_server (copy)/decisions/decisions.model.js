const mongoose = require('mongoose');
const { Decision } = require('../db');
const Schema = mongoose.Schema;

const decisionSchema = new Schema({
    DecisionItemID: {type: Number},
    DecisionItem_Title: {type: String},
    project_Name: {type: String},
    Description: {type: String},
    DecisionDate: {type: Date},
    DecisionTime: {type: String},
    DecisionAssignedTo: {type: String},
    Priority: {type: String},
    Status: {type: Number},
    MeetingID: {type: Number},
    // Meeting: {type: Meeting}
});

decisionSchema.set('toJSON', { virtuals: true });

const decisionModel = mongoose.model('Decision', decisionSchema);

module.exports = { decisionSchema, decisionModel}
