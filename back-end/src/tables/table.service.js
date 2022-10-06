const knex = require("../db/connection");
var types = require('pg').types

//get type parser from Postgres library to set integers returned as strings from db back to an integer
//needed as capacity property of a table is a number and needs to be validated as a proper integer in middleware 
//validation middleware is located in controller
types.setTypeParser(types.builtins.INT8, (val)=>parseInt(val,10))

function list(){
    return knex('tables').select('*').orderBy("table_name")
}

function create(table){
    return knex('tables').insert(table,'*').then((data)=>data[0])
}

module.exports = {
    list,
    create,
}