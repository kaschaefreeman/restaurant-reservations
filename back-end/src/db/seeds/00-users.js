const { genPassword } = require("../../utils/password-utils");
const users = require("./00-users.json");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex
    .raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE")
    .then(users.forEach((user) => {
      genPassword(process.env.SEED_PASSWORD)
        .then((password) => {user.password = password; return user})
    })
    )
    .then(()=>knex('users').insert(users))
}