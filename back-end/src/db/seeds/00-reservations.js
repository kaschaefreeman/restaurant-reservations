const reservations = require("./00-reservations.json");
const {fakerReservations} = require("../00-reservations-faker")

exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(function () {
      return knex("reservations").insert(reservations);
    })
    .then(()=>knex('reservations').insert(fakerReservations))
};
