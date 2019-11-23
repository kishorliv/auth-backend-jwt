// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('./user.model');

module.exports = {
    register,
    login,
    logout,
    getAll,
    getById
};

async function register(userData){
    if(await User.findOne({email: userData.email})){
        throw new Error('Email ' + userData.email + ' is already taken!');
    }
    const user = new User(userData);
    await user.save();
    //await user.generateAuthToken();   
    
    return user;
}

async function getAll(){
    return await User.find().select('-passwordHash');
}

async function getById(id){
    return await User.findById(id).select('-passwordHash');
}

async function login({email, password}){
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
        const token = await user.generateAuthToken(); // new auth token
        return {user, token};
    }
}

async function logout(user, token){
    return await user.removeToken(token);
}