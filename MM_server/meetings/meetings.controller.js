const express = require('express');
const router = express.Router();
const meetingService = require('./meetings.service');

router.post('/',postMeeting);
router.get('/',getMeetings)
router.post('/SendEmail', sendMail)
router.get('/:id', getMeetingById)
router.post('/filterMeetings', filterMeetings)
router.put('/updateMeeting/:id', updateMeeting)
router.post('/SendResheduleMeetingEmail', SendRescheduleMail)
router.get('/getAttachmentsByMeetingId/:id', getAttachmentsByMeetingId)
router.delete('/removeUserfromMeeting',removeUserfromMeeting)
router.post('/cancelMeeting/:id', cancelMeeting)

function postMeeting(req, res, next) {
    meetingService.postMeeting(req.body)
        .then(meeting => res.json(meeting))
        .catch(err => next(err));
}

function getMeetings(req, res, next){
    meetingService.getMeetings()
        .then(meetings => res.json(meetings))
        .catch(err => next(err));
}

function filterMeetings(req, res, next){
    meetingService.filterMeetings(req.body)
        .then(meetings => res.json(meetings))
        .catch(err => next(err));
}

function sendMail(req, res, next){
    meetingService.sendMail(req.body)
        .then(meeting => res.json(meeting))
        .catch(err => next(err))
}

function getMeetingById(req, res, next){
    meetingService.getMeetingById(req.params.id)
        .then(meeting => res.json(meeting))
        .catch(err => next(err))
}

function updateMeeting(req, res, next){
    meetingService.updateMeeting(req.params.id, req.body)
        .then(meeting => res.json(meeting))
        .catch(err => next(err))
}

function SendRescheduleMail(req, res, next){
    meetingService.SendRescheduleMail(req.body)
    .then(meeting => res.json(meeting))
    .catch(err => next(err))
}

function getAttachmentsByMeetingId(req, res, next){
    meetingService.getAttachmentsByMeetingId(req.params.id)
        .then(meetingNotes => res.json(meetingNotes))
        .catch(err => next(err));
}

function removeUserfromMeeting(req, res, next){
    meetingService.removeUserfromMeeting(req.body)
        .then(meeting => res.json(meeting))
        .catch(err => next(err));
}

function cancelMeeting(req, res, next){
    meetingService.cancelMeeting(req)
        .then(meeting => res.json(meeting))
        .catch(err => next(err));
}

module.exports = router;