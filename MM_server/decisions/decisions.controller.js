const express = require('express');
const router = express.Router();
const decisionService = require('./decisions.service');

router.post('/postDecision',postDecision);
router.get('/getDecisions', getDecisions);
router.get('/getDecisionByMeetingId/:id', getDecisionByMeetingId);
router.post('/filterDecision', filterDecision);
router.get('/getDecisionById/:id', getDecisionById);
router.put('/updateDecision/:id', updateDecision);

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

function filterDecision(req, res, next){
    decisionService.filterDecision(req.body)
        .then(decision=> res.json(decision))
        .catch(err => next(err))
}

function getDecisionById(req, res, next){
    decisionService.getDecisionById(req.params.id)
        .then(decision => res.json(decision))
        .catch(err => next(err))
}

function updateDecision(req, res, next){
    decisionService.updateDecision(req.params.id, req.body)
        .then(decision => res.json(decision))
        .catch(err => next(err))
}




module.exports = router;