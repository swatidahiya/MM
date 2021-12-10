var mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
var conn = mongoose.createConnection('mongodb://localhost/MM_backup', { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true});

module.exports = {
    
    ticketBackup:conn.model('actionBackup', require('./actions/actions.model').actionSchema),
    meetingNoteBackup: conn.model('meetingNoteBackup', require('./MeetingNote/MeetingNote.model').meetingNoteSchema) ,
    commentBackup: conn.model('commentBackup', require('./comments/comments.model').commentSchema),
    meetingBackup: conn.model('meetingBackup', require('./meetings/meetings.model').meetingSchema),
   
};