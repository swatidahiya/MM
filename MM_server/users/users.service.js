const config = require('../config.json');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const db = require('../db');
const User = db.User;

module.exports = {
    getById,
    checkUser,
    checkEmail,
    createUser,
    authenticateUser,
    getAllUsers,
    updateUser,
    deleteUser
}

async function getById(idParam) {
    return await User.findById(id).select('-hash');
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

    if (users.length > 0) {
        users = users.sort(function (a, b) { return b.AppUserID - a.AppUserID });
        userParam.AppUserID = users[0].AppUserID + 1;
        const user = new User(userParam);
        await user.save();
        console.log(user)

    }
    else {
        userParam.AppUserID = 1;
        const user = new User(userParam);
        await user.save();
        console.log(user)

    }
}

async function updateUser(req) {

    const user = await User.findOne({ AppUserID: req.params.id })
    Object.assign(user, req.body);
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