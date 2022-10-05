const knex = require("../db/connection");
/**
 * List handler that builds knex query to view all reservations in database filtered by reservation_date
 * @param {string} reservationDate
 * @returns {Array} Array of reservation Objects
 */
function listReservationsByDate(reservationDate) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: reservationDate })
    .orderBy("reservation_time");
}
/**
 * Read handler that builds knex query to view a reservation in database with given reservation_id
 * @param {Number} reservationId Id of reservation instance
 * @returns {Object} Object of reservation data
 */
function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

/**
 * Update handler that builds knex query to update a reservation instance in database with given reservation_id
 * @param {Object} updatedReservation Object of reservation data
 * @returns {Object} Object of reservation data
 */
function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((data) => data[0]);
}

/**
 * Create handler that builds knex query to insert a reservation in database
 * @param {Object} newReservation object of new reservation instance
 * @returns {Object} Object of reservation data
 */
function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((data) => data[0]);
}

module.exports = {
  listReservationsByDate,
  read,
  create,
  update,
};
