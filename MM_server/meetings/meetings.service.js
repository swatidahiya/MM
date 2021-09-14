const config = require('../config.json');
const jwt = require('jsonwebtoken');
const db = require('../db');
const Meeting = db.Meeting;

module.exports = {
    postMeeting,
    getMeetings
}

async function postMeeting(body){
    var meetingParams = body;
    var meetings = await getMeetings();

    if(meetings.length > 0) {
        meetingParams['MeetingID'] = meetings[0].MeetingID + 1;
    }
    else {
        meetingParams['MeetingID'] = 1;
    }
    

    const meeting = new Meeting(meetingParams);
    await meeting.save();
}

async function getMeetings() {
    const meetings = await Meeting.find().sort({ MeetingID: -1 });
    return meetings;

}
