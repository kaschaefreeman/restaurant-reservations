const knex = require("../db/connection");
const { read } = require("../reservations/reservations.service");
const { updateStatus } = require("../reservations/reservations.service");
var types = require("pg").types;

//get type parser from Postgres library to set integers returned as strings from db back to an integer
//needed as capacity property of a table is a number and needs to be validated as a proper integer in middleware
//validation middleware is located in controller
types.setTypeParser(types.builtins.INT8, (val) => parseInt(val, 10));

//Read Handler, reads a reservation by id
const readReservationId = read;
const updateReservationStatus = updateStatus;

//Update table with reservation_id
function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((data) => data[0]);
}

//Delete the reservation id from table
function unassignReservation(tableId) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .update({ reservation_id: null }, "*")
    .then((data)=>data[0])
}

function finishSeatReservation(tableId, reservationId) {
  return knex
    .transaction((t) => {
      knex("tables")
        .transacting(t)
        .then(unassignReservation(tableId))
        .then(updateReservationStatus(reservationId, "finished"))
        .then(t.commit)
        .catch(function (e) {
          t.rollback();
          throw e;
        });
    })
    .then(() => {})
    .catch((e) => {
      console.log(e);
    });
}

function seatReservationAtTable(updatedTable, reservationId) {
  return knex
    .transaction((t) => {
      knex("tables")
        .transacting(t)
        .then(update(updatedTable))
        .then(updateReservationStatus(reservationId, "seated"))
        .then(readReservationId(reservationId))
        .then(t.commit)
        .catch(function (e) {
          t.rollback();
          throw e;
        });
    })
    .then(() => {})
    .catch((e) => {
      console.log(e);
    });
}

module.exports = {
  update,
  readReservationId,
  seatReservationAtTable,
  finishSeatReservation,
};
