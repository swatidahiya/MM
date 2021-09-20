const express = require('express');
const router = express.Router();
const decisionService = require('./decisions.service');

router.post('/postDecision',postDecision);
router.get('/getDecisions', getDecisions);
router.get('/getDecisionByMeetingId/:id', getDecisionByMeetingId)

function postDecision(req, res, next) {
    decisionService.postDecision(req.body)
        .then(decision => res.json(decision))
        .catch(err => next(err));
}

function getDecisions(req, res, next){
    decisionService.getDecisions()
    .then(decision => res.json(decision))
    .catch(err => next(err));
}

function getDecisionByMeetingId(req, res, next){
    decisionService.getDecisionByMeetingId(req.params.id)
        .then(decision => res.json(decision))
        .catch(err => next(err))
}


module.exports = router;