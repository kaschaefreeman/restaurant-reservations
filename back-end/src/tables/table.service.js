const knex = require("../db/connection");
var types = require("pg").types;

//get type parser from Postgres library to set integers returned as strings from db back to an integer
//needed as capacity property of a table is a number and needs to be validated as a proper integer in middleware
//validation middleware is located in controller
types.setTypeParser(types.builtins.INT8, (val) => parseInt(val, 10));

//knex query list all tables in db
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

//Create handler - create new table instance
function create(newTable) {
  return knex("tables")
    .insert(newTable, "*")
    .then((data) => data[0]);
}

//Read handler - reads table by table id
function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

module.exports = {
  list,
  create,
  read,
};
