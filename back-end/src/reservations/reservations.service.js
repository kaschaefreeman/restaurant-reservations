const knex = require("../db/connection");
var types = require('pg').types

//get type parser from Postgres library to set integers returned as strings from db back to an integer
//needed as People property of reservation is a number and needs to be validated as a proper integer in middleware 
//validation middleware is located in controller
types.setTypeParser(types.builtins.INT8, (val)=>parseInt(val,10))

/**
 * List handler that builds knex query to view all reservations in database filtered by reservation_date
 * @param {string} reservationDate
 * @returns {Array} Array of reservation Objects
 */
function listReservationsByDate(reservationDate) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: reservationDate })
    .whereNot({status:"finished"})
    .whereNot({status:'cancelled'})
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
/**
 * Update handler that builds knex query to update status of reservation instance
 * @param {Object} reservationId the id of the reservation instance
 * @returns {Object} Object of reservation data
 */
function updateStatus(reservationId, status){
  return knex("reservations")
    .select("*")
    .where({reservation_id: reservationId})
    .update({status:status}, "*")
    .then((data)=>data[0])
}

module.exports = {
  listReservationsByDate,
  read,
  create,
  update,
  updateStatus
};
