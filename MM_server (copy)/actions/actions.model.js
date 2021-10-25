const mongoose = require('mongoose');
const { Action } = require('../db');
const Schema = mongoose.Schema;

const actionSchema = new Schema({
    ActionItemID: {type: Number},
    ActionItem_Title: {type: String},
    project_Name: {type: String},
    ActionDate: {type: String},
    ActionTime: {type: String},
    ActionAssignedTo: {type: String},
    Status: {type: Number},
    Priority: {type: String},
    Action_Description: {type: String},
    MeetingID: {type: Number},
    createdDate: { type: Date, default: Date.now },
    meetingName: {type: String},
    decision: {type: String, default: ''},

});

actionSchema.set('toJSON', { virtuals: true });

const actionModel = mongoose.model('Action', actionSchema);

module.exports = { actionSchema, actionModel}
