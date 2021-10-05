const express = require('express');
const router = express.Router();
const commentService = require('./comments.service');

router.post('/postComment',postComment);
router.get('/getAllComments/:id', getAllComments);

function postComment(req, res, next) {
    commentService.postComment(req.body)
        .then(comment => res.json(comment))
        .catch(err => next(err));
}

function getAllComments(req, res, next){
    commentService.getAllComments(req.params.id)
        .then(comment => res.json(comment))
        .catch(err => next(err));
}

module.exports = router;