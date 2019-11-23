const expressJwt = require('express-jwt');
const config = require('../config');
const userService = require('../users/user.service');

module.exports = validateJwt;

function validateJwt() {
    const secret = process.env.JWT_SECRET;

    return expressJwt({ secret }).unless({
        path: [
            '/users/register',
            '/users/login'
        ]
    });
}
