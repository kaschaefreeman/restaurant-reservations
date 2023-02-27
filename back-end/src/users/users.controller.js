const service = require('./users.service')
require("dotenv").config()

const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const { validPassword, genPassword } = require('../utils/password-utils');
const { issueJWT } = require('../utils/JWT/issueJWT')

/** Function to send JWT Token in response cookies
 * Will be used as nested middleware upon validation of a password for login route and after creating a new user
 */
function sendCookies(res) {
  const { user } = res.locals
  const jwt = issueJWT(user)
  const cookieOptions = (httpOnly=false,signed=false)=>{
    return {
      httpOnly,
      secure: process.env.NODE_ENV == 'production' ? true : false,
      expires: new Date(jwt.expires),
      signed,
      path: '/',
      sameSite: 'lax'
    }
  }
  res.cookie('jwt',jwt.token, cookieOptions(true,true))
  res.cookie('user',user.user_id, cookieOptions())
}

/**On Logout remove cookies and clear user from payload */
function removeCookies(req, res,next) {
  res.clearCookie('jwt')
  res.clearCookie('user')
  req.user =null
  res.sendStatus(204)
}

/**
 * List handler for users resources
 */
async function list(req, res) {
  const data = await service.list();
  res.status(200).json({ data });
}

/**** CREATE NEW USER FUNCTIONS *****/

/**Check user is not already stored in db 
 * to be used when registering a new user
*/
async function checkExistsingUserByPhone(req, res, next) {
  const user = await service.readByPhone(req.body.data.phone)
  user
    ? next({ status: 400, message: "User Already Exists with this Number, Please Login" })
    : next()
}



/**
 * Create handler for users resources
 */
async function create(req, res) {
  const { data } = req.body
  const { password } = data
  req.body.data.password = genPassword(password)
  const user = await service.create(data);
  sendCookies(res)
  res.status(201).json({ data: { user, jwt } });
}


/**** READ FUNCTIONS *****/

/**Check user exists by id
 * to be used when reading a user by id
*/
async function userExists(req, res, next) {
  const user = await service.read(req.params.user_id)
  if (user) {
    res.locals.user = user
  } else {
    next({ status: 404, message: 'User Not Found by id' })
  }
  next()
}

function read(req, res) {
  const { user } = res.locals
  res.status(200).json({ data: user })
}



/**** LOGIN FUNCTIONS *****/

/**Checks a user with the phone number given exists
 * to be used when user logs in with phone and password
 */
async function userExistsByPhone(req, res, next) {
  const user = await service.readByPhone(req.body.data.phone)
  if (user) {
    res.locals.user = user
    next()
  } else {
    next({
      status: 404,
      message: `User Not Found By Given Phone Number`,
    });
  }
}

async function passwordIsValid(req, res, next) {
  const { user } = res.locals
  const isValid = await validPassword(req.body.data.password, user.password)
  if (isValid) {
    sendCookies(res)
    res.status(200).json({ data: user })
  } else {
    next({ status: 401, message: 'Password Invalid, Please Try Again' })
  }
}



module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(checkExistsingUserByPhone), asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(userExists), read],
  login: [asyncErrorBoundary(userExistsByPhone), asyncErrorBoundary(passwordIsValid)],
  logout: removeCookies
}