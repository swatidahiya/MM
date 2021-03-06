const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = new Schema({
    PollID: {type: Number},
    Question: {type: String},
    Polldate: {type: Date},
    Active: {type: Boolean},
    options: {type: Array},
    answered: {type: Array},
});

pollSchema.set('toJSON', { virtuals: true });

const pollModel = mongoose.model('Poll', pollSchema);

module.exports = { pollSchema, pollModel}



