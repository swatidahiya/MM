const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    AppUserID: {type: Number, required: false},
    FirstName: {type: String, required: true},
    MiddleName: {type: String, required: false},
    LastName: {type: String, required: true},
    Initials: {type: String},
    Prefix: {type: String},
    Suffix: {type: String},
    LoginName: {type: String},
    Password: {type: String},
    DisabledDate: {type: Date},
    LoginAttemptsCount: {type: Number},
    AgreedToLicenseDate: {type: Date},
    SpecialOption: {type: String},
    IsActive: {type: Boolean},
    Email: {type: String},
    Phone: {type: String},
    CellPhone: {type: String},
    Fax: {type: String},
    AppUserNote: {type: String},
    SortNameFirstLast: {type: String},
    SortNameLastFirst: {type: String},
    DisplayName: {type: String},
    CreatedByID: {type: Number},
    CreatedDate: {type: Date, default: Date.now},
    ModifiedByID: {type: Number},
    ModifiedDate: {type: Date}

});

userSchema.set('toJSON', { virtuals: true });

const userModel = mongoose.model('User', userSchema);

module.exports = { userSchema, userModel}

        

