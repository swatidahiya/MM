const expressJwt = require('express-jwt');
const config = require('./config.json');
const userService = require('./users/users.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;

    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            /^\/User\/UserExists\/.*/,
            /^\/User\/UserEmailExists\/.*/,
            // '/User',
            // '/User/UserAuthenticate',
            '/User/getAllUsers',
            '/Meeting',
            '/Meeting/filterMeetings'
            
        ]
    });
}

        

async function isRevoked(req, payload, done) {
    console.log("inside isrevoked")
    console.log(payload.sub)
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};
