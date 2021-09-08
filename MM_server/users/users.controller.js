const express = require('express');
const router = express.Router();
const userService = require('./users.service');

// router.get('/:id', getUserById);
router.get('/UserExists/:id', checkUser);
router.get('/UserEmailExists/:id', checkEmail);
router.post('/', createUser);
router.get('', getAllUsers);
router.post('/UserAuthenticate',authenticateUser);

function checkUser(req, res, next) {
    console.log("inside controller")
    userService.checkUser(req.params.id)
        .then(() => res.json())
        .catch(err => next(err));
}

function checkEmail(req, res, next){
    console.log("inside controller again")
    userService.checkEmail(req.params.id)
        .then(() => res.json())
        .catch(err => next(err));
}

function createUser(req, res, next){
    userService.createUser(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllUsers(req, res, next){
    userService.getAllUsers()
        .then(() => res.json())
        .catch(err => next(err));
}

function authenticateUser(req, res, next){
    console.log(req)
    userService.authenticateUser(req.body)
        .then(() => res.json())
        .catch(err => next(err));
}





module.exports = router;

// function getUserById(req, res, next) {
//     userService.getUserById(req.params.id)
//         .then(user => user ? res.json(user) : res.sendStatus(404))
//         .catch(err => next(err));
// }
// function getAll(req, res, next){
//     userService.getAll(req.params.id)
//         .then(user => user ? res.json(user) : res.sendStatus(404))
//         .catch(err => next(err));
// }