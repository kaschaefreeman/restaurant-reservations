const { genPassword } = require("../../utils/password-utils");
const users = require("./00-users.json");

const getUsersWithPassword = async () => {
  const password = await genPassword(process.env.SEED_PASSWORD)
  return users.map(user => user = { ...user, password })
}

exports.seed = (knex) => {
  return (
    // Deletes ALL existing entries
    knex.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE")
      // Generate array of users with hashed password
      .then(getUsersWithPassword)
      // Insert seed entries
      .then(data => knex("users").insert(data))
  )
};
