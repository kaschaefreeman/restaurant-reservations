const bcrypt = require("bcrypt")

async function genPassword(password){
    return await bcrypt.hashSync(password,10,)
}

/**
 * Checks if hashed password matches a password given
 * @param {string} reqPassword - password recieved in request body
 * @param {string} dbPassword - hashed password stored in db
 * @returns {Promise<boolean>}  returns boolean if passwords are a match
 */
async function validPassword(reqPassword, dbPassword) {
    return await bcrypt.compareSync(reqPassword, dbPassword)
}

module.exports = {
    validPassword, genPassword
}