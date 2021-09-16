const config = require('../config.json');
const jwt = require('jsonwebtoken');
const db = require('../db');
const Meeting = db.Meeting;
var fs = require("fs");
const emailService = require('../emails/emails.service');



module.exports = {
    postMeeting,
    getMeetings,
    sendMail,
    getMeetingById
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
    console.log(meetings)
    return meetings;

}

async function sendMail(mailParam){
 console.log(mailParam)
    fs.readFile('meetingInvitation.html', 'utf8', function (err, data) {
        data = data.replace(/%UserName%/g, mailParam.toname);
        data = data.replace(/%MeetingSubject%/g, mailParam.MeetingSubject);
        data = data.replace(/%ShareLink%/g, mailParam.Meeting_Location);
        data = data.replace(/%MeetingDate%/g, mailParam.MeetingDate);
        data = data.replace(/%HostUser%/g, mailParam.HostUser);
        data = data.replace(/%meetingdescription%/g, mailParam.MeetingDescription);

        emailService.sendEmail(mailParam.toemail, 'Meeting Invitation', data)

    });
}

async function getMeetingById(id){
    const meeting = await Meeting.find({MeetingID : id})
    console.log(meeting)
    return meeting;
}
