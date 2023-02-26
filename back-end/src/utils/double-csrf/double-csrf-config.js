
/** Double CSRF token config 
 * CSRF Strategy is to send the csrf token in the response body and a hash of token in the cookies
 * the cookie will be read against the original token to be sent in request headers for validation
*/
const doubleCsrfOptions = {
    getSecret: () => process.env.CSRF_SECRET, //secret used to generate token
    cookieName: "csrfToken", //name of cookie to be sent with response (cookie with be hash of csrf token)
    cookieOptions: {
        httpOnly: true,
        sameSite: true,
        path: '/',
        maxAge: (24 *
            60 * 60 * 1000), //1 day - 24 hrs * 60 mins * 60 secs * 1000 ms
    },
    getTokenFromRequest: req => req.headers["x-csrf-token"] //Where original token where be read against the hashed cookie
}

module.exports = { doubleCsrfOptions }