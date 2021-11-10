const db = require('../db');
const Comment = db.Comment;
const Meeting = db.Meeting;
var fs = require("fs");
const emailService = require('../emails/emails.service');
const meetingService = require('../meetings/meetings.service');
const userService = require('../users/users.service')

module.exports = {
    postComment,
    getAllComments,
    getCommentsByMeetingId,
    getCommentsByActionId,
    postAgendaComment
}

async function postComment(commentParam) {
    const comment = new Comment(commentParam)

    var comments = await getAllComments();

    if (comments.length > 0) {
        comment['CommentID'] = comments[0].CommentID + 1;
    }
    else {
        comment['CommentID'] = 1;
    }

    await comment.save();

    const meeting = await meetingService.getMeetingById(comment.MeetingID)

    fs.readFile('meetingComment.html', 'utf8', function (err, data) {
        data = data.replace(/%UserName%/g, comment.HostUser);
        data = data.replace(/%MeetingSubject%/g, comment.meetingName);
        data = data.replace(/%comment%/g, comment.comment);

        emailService.sendEmail(meeting[0].Partipatents, 'Commented on Meeting', data, null)

    });

    // var participants = [];
    // const users = await userService.getAllUsers();

    // users.forEach(user => {
    //     commentParam.mentionData.forEach(id => {
    //         if(user.id == id) {
    //             participants.push(user.Email)
    //         }
    //     });
    // });

    if (commentParam.mentionData.length > 0) {

        fs.readFile('mentionUser.html', 'utf8', function (err, data) {
            data = data.replace(/%username%/g, commentParam.HostUser);
            data = data.replace(/%MeetingName%/g, commentParam.meetingName);
            data = data.replace(/%comment%/g, commentParam.comment);

            emailService.sendEmail(commentParam.mentionData, 'Mentioned you', data, null)

        });
    }

    return comment;

}

async function getAllComments() {
    const comments = await Comment.find().sort({ CommentID: -1 })
    return comments;
}


async function postAgendaComment(commentParam) {
    const comment = new Comment(commentParam)

    var comments = await getAllComments();

    if (comments.length > 0) {
        comment['CommentID'] = comments[0].CommentID + 1;
    }
    else {
        comment['CommentID'] = 1;
    }


    const meeting = await meetingService.getMeetingById(comment.MeetingID)

    comment['MeetingID'] = -1;

    await comment.save();

    fs.readFile('meetingComment.html', 'utf8', function (err, data) {
        data = data.replace(/%UserName%/g, comment.HostUser);
        data = data.replace(/%MeetingSubject%/g, comment.meetingName);
        data = data.replace(/%comment%/g, comment.comment);

        emailService.sendEmail(meeting[0].Partipatents, 'Commented on Agenda', data, null)

    });

    // var participants = [];
    // const users = await userService.getAllUsers();

    // users.forEach(user => {
    //     commentParam.mentionData.forEach(id => {
    //         if (user.id == id) {
    //             participants.push(user.Email)
    //         }
    //     });
    // });

    if (commentParam.mentionData.length > 0) {

        fs.readFile('mentionUser.html', 'utf8', function (err, data) {
            data = data.replace(/%username%/g, commentParam.HostUser);
            data = data.replace(/%MeetingName%/g, commentParam.meetingName);
            data = data.replace(/%comment%/g, commentParam.comment);

            emailService.sendEmail(commentParam.mentionData, 'Mentioned you', data, null)

        });
    }

    return comment;

}

async function getCommentsByMeetingId(id) {
    const comments = await Comment.find({ MeetingID: id }).sort({ CommentID: -1 })

    // var allcomments = []
    // comments.forEach(comment => {
    //     if(comment.ActionItemID == undefined || comment.ActionItemID == null) {
    //         allcomments.push(comment)
    //     }
    // });
    return comments;
}

async function getCommentsByActionId(id) {
    const comments = await Comment.find({ ActionItemID: id }).sort({ CommentID: -1 })
    return comments;
}