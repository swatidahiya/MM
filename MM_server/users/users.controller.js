const express = require('express');
const router = express.Router();
const userService = require('./users.service');

// router.get('/:id', getUserById);
router.get('/UserExists/:id', checkUser);
router.get('/UserEmailExists/:id', checkEmail);
router.post('/', createUser);
router.get('/getAllUsers', getAllUsers);
router.get('/:id',getById)
router.put('/:id', updateUser);
router.post('/UserAuthenticate',authenticateUser);
router.delete('/:id',deleteUser);

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(err => next(err));
}

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

function updateUser(req, res, next){
    userService.updateUser(req)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function getAllUsers(req, res, next){
    userService.getAllUsers()
        .then(user => res.json(user))
        .catch(err => next(err));
}

function authenticateUser(req, res, next){
    // console.log(req)
    userService.authenticateUser(req.body)
        .then (user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function deleteUser(req, res, next) {
    userService.deleteUser(req.params.id)
        .then(users => res.json(users))
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