const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    CommentID: {type: Number},
    project_Name: {type: String},
    Comment1: {type: String},
    CommentDate: {type: Date, default: Date.now},
    CommentTime: {type: String},
    Status: {type: Number},
    HostUser:   {type: String},
    MeetingID: {type: Number},
    ActionID: {type: Number},
    DecisionID: {type: Number}
});

commentSchema.set('toJSON', { virtuals: true });

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = { commentSchema, commentModel}

