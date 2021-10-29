const config = require('../config.json');
const jwt = require('jsonwebtoken');
const db = require('../db');
const Meeting = db.Meeting;
var fs = require("fs");
const emailService = require('../emails/emails.service');
const MeetingNote = db.MeetingNotes;



module.exports = {
    postMeeting,
    getMeetings,
    sendMail,
    getMeetingById,
    filterMeetings,
    updateMeeting,
    SendRescheduleMail,
    getAttachmentsByMeetingId
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

    return meeting;
}

async function getMeetings() {
    const meetings = await Meeting.find().sort({ MeetingID: -1 });
    // console.log(meetings)
    return meetings;

}

async function getAttachmentsByMeetingId(meetingID){
    const meetingNotes = await MeetingNote.find({meetingID: meetingID}).sort({ createdDate: -1 });
    return meetingNotes;
}

async function filterMeetings(object) {
    var meetingName = object.meetingName;
    var status = object.status;
    var user = object.user;
    var meetings = [];

    let data = await Meeting.find({ Status: object.status });
   
    if(data.length > 0) {
        if(meetingName === undefined && user === undefined) {
            return data;
        }

        else if(meetingName !== undefined && user === undefined){
            var meetName = meetingName.toLowerCase();
            var re = new RegExp(meetName, "g");
            data.forEach(meeting => {
                var name = meeting.Meeting_Subject.toLowerCase();
                if (name.search(re) == -1) {
                    console.log("Not Found");
                } else {
                    meetings.push(meeting);
                    console.log("Found");
                }
            })
            return meetings;
        }

        else if(user !== undefined && meetingName === undefined ) {
            data.forEach(meeting => {
                if(meeting.HostUser === user) {
                    meetings.push(meeting)
                }
            });
            return meetings;
        }
        else if(meetingName !== undefined && meetingName !== null) {
            var meetName = meetingName.toLowerCase();
            var re = new RegExp(meetName, "g");
            data.forEach(meeting => {
                var name = meeting.Meeting_Subject.toLowerCase();
                if (name.search(re) == -1 ) {
                    console.log("Not Found");
                } else {
                    if(meeting.HostUser === user){
                        meetings.push(meeting);
                        console.log("Found");
                    }
                    
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
        data = data.replace(/%HostUserMail%/g, mailParam.HostUserMail);
        var calendarObj = emailService.getIcalObjectInstance(mailParam.MeetingDate, mailParam.MeetingSubject, mailParam.MeetingDescription, mailParam.Meeting_Location, mailParam.HostUser, mailParam.HostUserMail)
        emailService.sendEmail(mailParam.toemail, 'Meeting Invitation', data , calendarObj)

    });
}

async function getMeetingById(id){
    const meeting = await Meeting.find({MeetingID : id})
    // console.log(meeting)
    return meeting;
}

async function updateMeeting(id, object){
    const meeting = await Meeting.findOne({MeetingID: id})
    // console.log(meeting);
    // console.log("-------------------------")
    // console.log(object);
    Object.assign(meeting, object);
    await meeting.save();
    return meeting;
}

async function SendRescheduleMail(mailParam){
    console.log("-----------------------mailParam-------------------------")
    console.log(mailParam)
    fs.readFile('meetingReschedule.html', 'utf8', function(err, data){
        data = data.replace(/%MeetingSubject%/g, mailParam.MeetingSubject);
        data = data.replace(/%Meeting_Location%/g, mailParam.Meeting_Location);
        data = data.replace(/%MeetingDate%/g, mailParam.MeetingDate);
        data = data.replace(/%NewMeetingDate%/g, mailParam.NewMeetingDate);
        data = data.replace(/%HostUser%/g, mailParam.HostUser);
        data = data.replace(/%meetingdescription%/g, mailParam.meetingdescription);

        emailService.sendEmail(mailParam.toemail, 'Meeting Rescheduled', data)
    });
}


