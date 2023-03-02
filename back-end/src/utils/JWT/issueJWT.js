const jsonwebtoken = require('jsonwebtoken');
const { cookieOptions } = require('../cookieOptions');
const PRIV_KEY = process.env.PRIVATE_KEY.replace(/^\s+|\s+$/gm, '');


/** Issue a JWT token
 * @param {Response} res - request response
 * @param {object} user - instance of the user to give a signed JWT authorization token
 * @returns returns object with signed token and the length in time token expires
 **/
function issueJWT(res, user) {
    const { user_id } = user

    const expiresIn = '1d';

    const payload = {
        sub: user_id,
        iat: Date.now()
    };
    // declare signed token that is signed with the generated private key
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

    res.cookie('jwt', signedToken, cookieOptions(true))

    return {
        // token: "Bearer " + signedToken,
        token: signedToken,
        expires: Date.now() + (24 * 60 * 60 * 1000) //1 day - 24 hrs * 60 mins * 60 secs * 1000 ms
    }
}

module.exports = { issueJWT }