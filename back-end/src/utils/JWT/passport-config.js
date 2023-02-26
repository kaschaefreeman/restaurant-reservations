
const knex = require('../../db/connection')

const JwtStrategy = require('passport-jwt').Strategy
const fs = require('fs');
const path = require('path');
const pathToKey = path.join(__dirname, '..', '/JWT/key_pairs', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8') || process.env.PUBLIC_KEY;

/** JWT Strategy 
 * locate a user where their username will be the phone number
 * Then issue a signed HTTP Only cookie in the response with their JWT Token and another cookie with the userID that can be access and read by the front-end
 * All requests that require authentification must provide the signed JWT Token
 * The token in the request cookies will be validated against the payload
 */

/** JWT Strategy Options */
// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
    jwtFromRequest: req => req.signedCookies.jwt, // Get jwt from request cookies
    secretOrKey: PUB_KEY, // Secret key is the public key generated from key pairs used to verify the signed token
    algorithms: ['RS256']
};
/**************************/

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
    // The JWT payload is passed into the verify callback
    passport.use(new JwtStrategy(options, function (jwt_payload, done) {
        //Locate user in database with ID matching the payload sub (payload sub is assigned the user_id when token is issued)
        knex('users')
            .select('*')
            .where({ user_id: jwt_payload.sub })
            .first()
            .then((user) => {
                user
                    ? done(null, user) // Successful locate return null error and user
                    : done({ status: 404, message: 'No User Found by this Phone Number' }, false) // return error and false as no user found
            })
            .catch((err) => done(err, null))
    }));
}
