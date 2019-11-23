const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const userService = require('./user.service');

// routes
router.get('/getAll', getAll);
router.get('/me', getMe);
router.get('/:id', getById);
router.post('/register', register);
router.post('/login', login);
router.post('/me/logout', logout);

module.exports = router;


function getAll(req, res, next){
    userService.getAll()
    .then(users => res.send({users}))
    .catch(err => next(err));
}

function getMe(req, res){
    res.send(req.user);
}

function getById(req, res, next){
    userService.getById(req.params.id)
    .then(user => user ? res.send({user}) : res.status(404).send({message: 'User not found.'}))
    .catch(err => next(err));  
}

function register(req, res, next){
    userService.register(req.body)
    .then(user => user ? res.status(201).send(user) : res.status(400).send({message: 'User cannot be created'}))
    .catch(err => next(err));
}

function login(req, res, next){
    userService.login(req.body)
    .then((result) => (result) ? res.send({...result}) : res.status(400).send({message: 'Incorrect email or password'}))
    .catch(err => next(err));
}

function logout(req, res, next){
    const token = req.header('Authorization').replace('Bearer ', '');
    userService.getById(req.user.sub)
    .then(user => {
        return user;})
    .then(user => {
        userService.logout(user, token)
        .then(() => res.send({message: 'Logged out.'}))
        .catch((err) => next(err));
    })
    .catch(err => next(err));
}
