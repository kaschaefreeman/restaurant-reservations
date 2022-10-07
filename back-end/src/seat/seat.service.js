const knex = require("../db/connection");
const {read} = require("../reservations/reservations.service")
var types = require("pg").types;

//get type parser from Postgres library to set integers returned as strings from db back to an integer
//needed as capacity property of a table is a number and needs to be validated as a proper integer in middleware
//validation middleware is located in controller
types.setTypeParser(types.builtins.INT8, (val) => parseInt(val, 10));

function update(updatedTable) {
    return knex("tables")
      .select("*")
      .where({ table_id: updatedTable.table_id })
      .update(updatedTable, "*")
      .then((data) => data[0]);
  }

const readReservationId = read

module.exports = {
  update, 
  readReservationId,
}