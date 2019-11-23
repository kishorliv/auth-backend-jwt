const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

const schema = new Schema({
    email: { 
        type: String, 
        unique: true, 
        required: true 
    },
    passwordHash: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    createdDate: { 
        type: Date, 
        default: Date.now 
    },
    tokens: [{
        token: {
            type: String, 
            required: true
        }
    }]
});

// hashing password before saving the object
schema.pre('save', function(next){
    const user = this;
    if(user.isModified('passwordHash')){
        user.passwordHash = bcrypt.hashSync(user.passwordHash, stage.saltingRounds);
    }
    next();
});

// generating jwt token for user
schema.methods.generateAuthToken = async function() {
    const user = this;  
    const payload = {sub: user._id};
    const secret = process.env.JWT_SECRET;
    const options = {expiresIn: '2d'};

    const token = jwt.sign(payload, secret, options);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

schema.methods.removeToken = async function(token){
    const user = this;
    
    return await user.update({
        $pull: {
            tokens: {token}
        }
    });
}

module.exports = mongoose.model('User', schema);
