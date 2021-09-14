const express = require('express');
const router = express.Router();
const meetingService = require('./meetings.service');

router.post('/',postMeeting);
router.get('/',getMeetings)

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

module.exports = router;