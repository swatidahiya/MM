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
    filterMeetings
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

async function filterMeetings(object) {
    var projectName = object.projectName;
    var status = object.status;
    var user = object.user;
    var meetings = [];

    let data = await Meeting.find({ Status: object.status });
   
    if(data.length > 0) {
        if(projectName === undefined && user === undefined) {
            return data;
        }

        else if(projectName !== undefined && user === undefined){
            data.forEach(meeting => {
                var name = meeting.project_Name;
                if(name.toLowerCase() === projectName) {
                    meetings.push(meeting)
                }
            })
            return meetings;
        }

        else if(user !== undefined && projectName === undefined ) {
            data.forEach(meeting => {
                if(meeting.HostUser === user) {
                    meetings.push(meeting)
                }
            });
            return meetings;
        }
        else if(projectName !== undefined && projectName !== null) {
            data.forEach(meeting => {
                var name = meeting.project_Name.toLowerCase();
                if(name === projectName && meeting.HostUser === user) {
                    meetings.push(meeting)
                }
            })
            return meetings;
        }
        
    }
    else {
        return null;
    }

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
