const config = require('../config.json');
const jwt = require('jsonwebtoken');
const db = require('../db');
const Meeting = db.Meeting;
const User = db.User;
var fs = require("fs");
const emailService = require('../emails/emails.service');
const MeetingNote = db.MeetingNotes;
var cron = require('node-cron');
var moment = require("moment");
const actionService = require('../actions/actions.service');
const userService = require('../users/users.service')

cron.schedule('0 0 * * *', async () => {
  console.log('running a task every day at midnight');
  var date = new Date();
  var tempDate = Date.parse(date);
  date.setDate(date.getDate() + 2);
  var newDate = Date.parse(date);
  var meetings = await getMeetings();
  for(let i=0; i< meetings.length; i++){
    if(meetings[i].recurrence === true){
        var meetingDate = meetings[i].MeetingDate;
    testDate = Date.parse(meetingDate)
    var newScheduledDate = meetingDate.setDate(meetingDate.getDate() + 7);
    var difference = newDate - newScheduledDate;
    if(difference >= 0 && difference < 86400000){
        var obj = meetings[i].toJSON();
        delete obj._id;
        var prevMeetingID = obj.MeetingID
        obj.MeetingDate = new Date(newScheduledDate).toISOString()
        obj.MeetingTime = obj.MeetingDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        var createNewMeet = await postMeeting(obj);
        var mailObject = {};
        mailObject["subject"] = "Meeting Invitation",
        mailObject["message"] = "You are invited as a Participant in this meeting. Please login and check Meeting name " + obj.Meeting_Subject;
        mailObject["MeetingSubject"] = obj.Meeting_Subject;
        mailObject["MeetingDate"] = obj.MeetingTime;
        mailObject["HostUser"] = obj.HostUser;
        mailObject["MeetingDescription"] = obj.Meeting_objective;
        let user = await userService.getByUserName(obj.HostUser);
        mailObject["HostUserMail"] = user.Email;
        mailObject["Meeting_Location"] =  "https://mmv1.checkboxtechnology.com/videoRoom/" + obj.RoomKey;
        mailObject["toemail"]= meetings[i].Partipatents;
        await sendMail(mailObject);
    
        let meetingActions = await actionService.getActionByMeetingId(prevMeetingID);
       
        for(let j=0; j< meetingActions.length; j++){
            if(meetingActions[j].Status !== 2){
            
                var actionObj = meetingActions[j].toJSON();
                delete actionObj._id;
                actionObj.MeetingID = createNewMeet.MeetingID;
                let actionCreated = await actionService.postAction(actionObj);
            }
        }

    }
    }
    
  }
  
});


module.exports = {
    postMeeting,
    getMeetings,
    sendMail,
    getMeetingById,
    filterMeetings,
    updateMeeting,
    SendRescheduleMail,
    getAttachmentsByMeetingId,
    removeUserfromMeeting,
    cancelMeeting
}


async function postMeeting(body){
    var meetingParams = body;
    console.log(meetingParams);
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
 var link = "<a href = '" + mailParam.Meeting_Location + "'><span>" + mailParam.Meeting_Location + "</span></a>"
 console.log(link)
    fs.readFile('meetingInvitation.html', 'utf8', function (err, data) {
        data = data.replace(/%UserName%/g, mailParam.toname);
        data = data.replace(/%MeetingSubject%/g, mailParam.MeetingSubject);
        data = data.replace(/%ShareLink%/g, link);
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
    return meeting;
}

async function updateMeeting(id, object){
    const meeting = await Meeting.findOne({MeetingID: id})
    Object.assign(meeting, object);
    await meeting.save();
    return meeting;
}

async function SendRescheduleMail(mailParam){
 
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

async function removeUserfromMeeting(userParam) {

    fs.readFile('meetingCancel.html', 'utf8', function(err, data){
        data = data.replace(/%MeetingSubject%/g, userParam.Meeting_Subject);
        data = data.replace(/%Meeting_Location%/g, userParam.Meeting_Location);
        data = data.replace(/%MeetingDate%/g, userParam.MeetingTime);
        data = data.replace(/%HostUser%/g, userParam.HostUser);

        emailService.sendEmail(userParam.Partipatents, 'Meeting cancelled', data)
    });
}

async function cancelMeeting(req) {
    const user = await User.findOne({LoginName: req.params.id});

    var object = req.body;
    object.Status = 2;

    const meeting = await Meeting.findOne({MeetingID: req.body.MeetingID})
    Object.assign(meeting, object);
    await meeting.save();

    fs.readFile('meetingCancel.html', 'utf8', function(err, data){
        data = data.replace(/%MeetingSubject%/g, req.body.Meeting_Subject);
        data = data.replace(/%Meeting_Location%/g, req.body.Meeting_Location);
        data = data.replace(/%MeetingDate%/g, req.body.MeetingTime);
        data = data.replace(/%HostUser%/g, req.body.HostUser);

        emailService.sendEmail(req.body.Partipatents, 'Meeting cancelled', data)
    });

    return meeting;

}


