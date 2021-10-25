const express = require('express');
const router = express.Router();
const actionService = require('./actions.service');

router.post('/postAction',postAction);
router.get('/getActions', getActions);
router.get('/getActionByMeetingId/:id', getActionByMeetingId);
router.post('/filterActions', filterActions);
router.get('/getActionById/:id', getActionById);
router.put('/updateAction/:id', updateAction);

function postAction(req, res, next) {
    console.log("inside controller of action")
    actionService.postAction(req.body)
        .then(action => res.json(action))
        .catch(err => next(err));
}

function getActions(req, res, next){
    actionService.getActions()
    .then(action => res.json(action))
    .catch(err => next(err));
}

function getActionByMeetingId(req, res, next){
    console.log("inside getActionbymeetingid")
    actionService.getActionByMeetingId(req.params.id)
        .then(action => res.json(action))
        .catch(err => next(err))
}

function filterActions(req, res, next){
    actionService.filterActions(req.body)
        .then(action => res.json(action))
        .catch(err => next(err))
}

function getActionById(req, res, next){
    actionService.getActionById(req.params.id)
        .then(action => res.json(action))
        .catch(err => next(err))
}

function updateAction(req, res, next){
    actionService.updateAction(req.params.id, req.body)
        .then(action => res.json(action))
        .catch(err => next(err))
}


module.exports = router;