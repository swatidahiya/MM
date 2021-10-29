const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const meetingNoteSchema = new Schema({
    meetingID: { type: Number, required: false },
    username: { type: String, required: false },
    userFirstname: {type: String, required: false},
    attachmentName: { type: String, required: false },
    originalName: { type: String, required: false},
    createdDate: { type: Date, default: Date.now },
    thumbnail: { type: String, required: false }
});

meetingNoteSchema.set('toJSON', { virtuals: true });

const MeetingNoteModel = mongoose.model('MeetingNote', meetingNoteSchema);

module.exports = {MeetingNoteModel, meetingNoteSchema}