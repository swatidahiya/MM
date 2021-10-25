const express = require('express');
const router = express.Router();
const commentService = require('./comments.service');

router.post('/postComment',postComment);
router.post('/postAgendaComment',postAgendaComment);
router.get('/getAllComments/', getAllComments);
router.get('/getCommentsByMeetingId/:id', getCommentsByMeetingId);
router.get('/getCommentsByActionId/:id', getCommentsByActionId);

function postComment(req, res, next) {
    commentService.postComment(req.body)
        .then(comment => res.json(comment))
        .catch(err => next(err));
}

function postAgendaComment(req, res, next) {
    commentService.postAgendaComment(req.body)
        .then(comment => res.json(comment))
        .catch(err => next(err));
}

function getAllComments(req, res, next){
    commentService.getAllComments()
        .then(comment => res.json(comment))
        .catch(err => next(err));
}

function getCommentsByMeetingId(req, res, next){
    commentService.getCommentsByMeetingId(req.params.id)
        .then(comment => res.json(comment))
        .catch(err => next(err));
}

function getCommentsByActionId(req, res, next){
    commentService.getCommentsByActionId(req.params.id)
        .then(comment => res.json(comment))
        .catch(err => next(err));
}

module.exports = router;