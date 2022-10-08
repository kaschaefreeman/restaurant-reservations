const knex = require("../db/connection");
const {read} = require("../reservations/reservations.service")
var types = require("pg").types;

//get type parser from Postgres library to set integers returned as strings from db back to an integer
//needed as capacity property of a table is a number and needs to be validated as a proper integer in middleware
//validation middleware is located in controller
types.setTypeParser(types.builtins.INT8, (val) => parseInt(val, 10));

//Read Handler, reads a reservation by id
const readReservationId = read

//Update table with reservation_id
function update(updatedTable) {
    return knex("tables")
      .select("*")
      .where({ table_id: updatedTable.table_id })
      .update(updatedTable, "*")
      .then((data) => data[0]);
  }

//Delete the reservation id from table
function unassignReservation(tableId){
  return knex("tables")
    .select("*")
    .where({table_id: tableId})
    .update({reservation_id: null},"*")
}


module.exports = {
  update, 
  readReservationId,
  unassignReservation
}