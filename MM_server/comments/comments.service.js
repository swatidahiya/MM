const db = require('../db');
const Comment = db.Comment;

module.exports = {
   postComment,
   getAllComments
}

async function postComment(commentParam){
    const comment = new Comment(commentParam)
    console.log(comment)
    await comment.save();
}

async function getAllComments(commentParam){
    const comments = await Comment.find({MeetingID : commentParam})
    console.log(comments)
    return comments;
}