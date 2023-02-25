const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', '/JWT/key_pairs', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

/** Issue a JWT token
 * @param {object} user - instance of the user to give a signed JWT authorization token
 * @returns returns object with signed token and the length in time token expires
 **/
function issueJWT(user) {
    const { user_id } = user

    const expiresIn = '1d';

    const payload = {
        sub: user_id,
        iat: Date.now()
    };
    // declare signed token that is signed with the generated private key
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

    return {
        // token: "Bearer " + signedToken,
        token: signedToken,
        expires: Date.now() + (24 * 60 * 60 * 1000) //1 day - 24 hrs * 60 mins * 60 secs * 1000 ms
    }
}

module.exports = { issueJWT }