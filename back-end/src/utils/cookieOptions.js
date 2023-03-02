/**
 * Default cookie options to be for JWT and CSRF cookie
 * return object of cookie options with optional signed property
 * @param {boolean} signed - boolean if cookie is to be a signed cookie
 * @returns object with cookie properties
 */

const cookieOptions = (signed = false) => {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production' ? true : false,
        expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
        signed,
        path: '/',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : null,
        Domain: process.env.NODE_ENV === 'production' ? process.env.CLIENT_BASE_URL : 'localhost',
    }
}

/**
 * Cookie options to remove the JWT cookie from client
 * To be called with res.clearCookies
 */
const clearCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV == 'production' ? true : false,
    expires: new Date(Date.now() - (24 * 60 * 60 * 1000)),
    path: '/',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : null,
    Domain: process.env.NODE_ENV === 'production' ? process.env.CLIENT_BASE_URL : 'localhost',
}

module.exports = { cookieOptions, clearCookieOptions }