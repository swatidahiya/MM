const config = require('../config.json');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const db = require('../db');
const User = db.User;

module.exports = {
    checkUser,
    checkEmail,
    createUser,
    authenticateUser,
    getAllUsers
}

async function checkUser(loginNameParam){
    if (await User.findOne({ LoginName: loginNameParam })) {
        throw 'Username "' + loginNameParam + '" is already taken';
    }

    return true
}

async function checkEmail(emailParam){
    if (await User.findOne({ Email: emailParam })) {
        console.log(emailParam)
        throw 'Email Id "' + emailParam + '" is already taken';
    }
    return true
}

async function createUser(userParam){
    const user = new User(userParam);
    console.log(user);
    await user.save();
}

async function authenticateUser(userParam){
    console.log("inside authenticateUser")
    console.log(userParam)
    const user = await User.findOne({ LoginName: userParam.LoginName });
    console.log(user)
    if(userParam.Password === user.Password){
        console.log("matched")
        return true;
    }
}

async function getAllUsers(){
    return await User.find().select();
}