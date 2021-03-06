const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
    AppUserID: {type: Number, required: false},
    FirstName: {type: String, required: false},
    MeetingID: {type: Number, default: 0},
    project_Name: {type: String},
    Meeting_Subject: {type: String},
    Meeting_objective: {type: String},
    Conclusion: {type: String},
    Agenda: {type: String},
    Agenda_SubItem: {type: String},
    MeetingDate: {type: Date},
    MeetingTime: {type: String},
    MeetingAssignedTo: {type: Array},
    recurrence: {type: Boolean},
    Meeting_Location: {type: String},
    Partipatents: {type: Array},
    Share_Link: {type: String},
    Status: {type: Number},
    RoomKey: {type: Number},
    HostUser: {type: String},

    //Comment: {type: Comment},
    // Action_Item: MeetingActions,
    // Decision_Item: {type: Decisions},
    // Meeting_Notes: {}

});

meetingSchema.set('toJSON', { virtuals: true });

const meetingModel = mongoose.model('Meeting', meetingSchema);

module.exports = { meetingSchema, meetingModel}
