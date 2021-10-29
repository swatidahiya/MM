const config = require('./config.json');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGODB_URI ||config.connectionString, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', () => console.log('Connection failed with - ',err));
// var con = mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

mongoose.Promise = global.Promise;

module.exports = {
    User: require('./users/users.model').userModel, 
    Meeting: require('./meetings/meetings.model').meetingModel,
    Action: require('./actions/actions.model').actionModel,
    Decision: require('./decisions/decisions.model').decisionModel, 
    Comment: require('./comments/comments.model').commentModel,
    Poll: require('./polls/polls.model').pollModel,
    MeetingNotes: require('./MeetingNote/MeetingNote.model').MeetingNoteModel
    
};
