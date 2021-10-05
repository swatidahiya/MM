const express = require('express');
const router = express.Router();
const pollService = require('./polls.service');

router.post('/createPoll',createPoll);
router.get('/getAllPoll',getAllPoll);


function createPoll(req, res, next) {
    pollService.createPoll(req.body)
        .then(poll => res.json(poll))
        .catch(err => next(err));
}

function getAllPoll(req, res, next){
    pollService.getAllPoll()
        .then(poll => res.json(poll))
        .catch(err => next(err));
        
}

module.exports = router;