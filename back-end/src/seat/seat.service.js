const knex = require("../db/connection");
const { read } = require("../reservations/reservations.service");
const { updateStatus } = require("../reservations/reservations.service");
var types = require("pg").types;

//get type parser from Postgres library to set integers returned as strings from db back to an integer
//needed as capacity property of a table is a number and needs to be validated as a proper integer in middleware
//validation middleware is located in controller
types.setTypeParser(types.builtins.INT8, (val) => parseInt(val, 10));

/*********************** Helper Functions ***********************
 ****************************************************************/

//Read Handler, reads a reservation by id
//needed to validate the reservation id is a valid id
const readReservationId = read;

//Update handler that updates the status of a reservation
//needed to update the reservation status when the table is assigned a reservation id "reservations is seated"
//or when reservation id is removed from a table "reservation and table is finished"
const updateReservationStatus = updateStatus;

//Update table with reservation_id
//Used to "seat" reservation at a table
function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((data) => data[0]);
}

//Delete the reservation id from table
//Used to "finish" a table
function unassignReservation(tableId) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .update({ reservation_id: null }, "*")
    .then((data) => data[0]);
}
/**************************UPDATE TABLE AND RESERVATION STATUS *********************************
 * The below functions create the knex queries to update the reservation and table when a reservation is seated or finished
 * A reservation is seated when the id is added to a table and finished when the id is removed from the table instance
 ********************************************************************************************************/

//Assign table a reservation id and update the reservation as seated
//Used when user selects "seat" on a reservation on the front end
function seatReservationAtTable(updatedTable, reservationId) {
  return knex.transaction((t) => {
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
  });
}
//Update the reservation status as finished and remove reservation id from the table
//Used when user selects finish table on front-end
function finishSeatReservation(tableId, reservationId) {
  return knex.transaction((t) => {
    knex("tables")
      .transacting(t)
      .then(unassignReservation(tableId))
      .then(updateReservationStatus(reservationId, "finished"))
      .then(t.commit)
      .catch(function (e) {
        t.rollback();
        throw e;
      });
  });
}

module.exports = {
  update,
  readReservationId,
  seatReservationAtTable,
  finishSeatReservation,
};
