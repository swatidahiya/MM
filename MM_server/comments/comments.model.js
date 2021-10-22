const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    CommentID: {type: Number},
    meetingName: {type: String},
    comment: {type: String},
    CommentDate: {type: Date, default: Date.now},
    CommentTime: {type: String},
    // Status: {type: Number},
    HostUser: {type: String},
    MeetingID: {type: Number},
    ActionItemID: {type: String},
    // DecisionID: {type: String},
});

commentSchema.set('toJSON', { virtuals: true });

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = { commentSchema, commentModel}

