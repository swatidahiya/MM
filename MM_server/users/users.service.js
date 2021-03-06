const config = require('../config.json');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const db = require('../db');
const User = db.User;
var fs = require('fs');
const emailService = require('../emails/emails.service');

module.exports = {
    getById,
    checkUser,
    checkEmail,
    createUser,
    authenticateUser,
    getAllUsers,
    updateUser,
    deleteUser,
    updateProfile,
    base64_encode,
    forgotPassword,
    getUser,
    getByUserName
}

async function getById(idParam) {
    return await User.findOne({AppUserID:idParam}).select('-hash');
}

async function getUser(id) {
    return await User.findOne(id).select('-hash');
}

async function checkUser(loginNameParam) {
    if (await User.findOne({ LoginName: loginNameParam })) {
        throw 'Username "' + loginNameParam + '" is already taken';
    }
    return true
}

async function checkEmail(emailParam) {
    if (await User.findOne({ Email: emailParam })) {
        console.log(emailParam)
        throw 'Email Id "' + emailParam + '" is already taken';
    }
    return true
}

async function createUser(userParam) {
    var users = await getAllUsers();

    const default_profile = await base64_encode('assets/default_icon.png');

    if (users.length > 0) {
        users = users.sort(function (a, b) { return b.AppUserID - a.AppUserID });
        userParam.AppUserID = users[0].AppUserID + 1;
        const user = new User(userParam);
        user.profilePic = fs.readFileSync('assets/default_icon.png');
        user.imageSrc = default_profile;
        // const user = new User(userParam);
        await user.save();

    }
    else {
        userParam.AppUserID = 1;
        const user = new User(userParam);
        user['Initials'] = "sAdmin";
        user['IsActive'] = true;
        user.profilePic = fs.readFileSync('assets/default_icon.png');
        user.imageSrc = default_profile;
        await user.save();
    }
}

async function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

async function updateUser(req) {
 
    const user = await User.findOne({ AppUserID: req.params.id })
    console.log("this is user")
    cons .log(user)
    console.log("this is rq.body")
    console.log(req.body)
    Object.assign(user, req.body);
    await user.save();
    return user;
}

async function getByUserName(name){
    const user = await User.findOne({LoginName: name})
    return user;
}

async function updateProfile(id, body) {

    const user = await User.findOne({ AppUserID: id })
    Object.assign(user, body);
    await user.save();
    return user;
}

async function authenticateUser(userParam) {

    const user = await User.findOne({ $and: [{ LoginName: userParam.LoginName }, { Password: userParam.Password }] });
    if (user) {

        const token = jwt.sign({ sub: user.id }, config.secret, {
            expiresIn: '4d'
        });
        return {
            token
        }
    }
}

async function getAllUsers() {
    const users = await User.find().select();
    return users;
}

async function deleteUser(id) {
    const user = await User.findOne({AppUserID: id})
    await User.findByIdAndDelete(user._id);
}

async function forgotPassword(mailParam){
    console.log(mailParam);
    fs.readFile('forgotPassword.html', 'utf8', function(err, data){
        data = data.replace(/%UserName%/g, mailParam.toname);
        emailService.sendEmail(mailParam.toemail, 'Meeting Minutes - Password Reset', data)
    });
}






