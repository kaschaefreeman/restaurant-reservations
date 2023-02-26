const knex = require("../db/connection");

//knex query list all users in db
function list() {
    return knex("users").select("*").orderBy("user_name");
  }
  
  //Create handler - create new table instance
  function create(newUser) {
    return knex("users")
      .insert(newUser, "*")
      .then((data) => data[0]);
  }
  
  //Read handler - reads user by phone
  function readByPhone(phone) {
    return knex("users").select("*").where({ phone }).first();
  }
  
  function read(user_id){
    return knex('users').select("*").where({user_id}).first()
  }

  module.exports = {
    list,
    create,
    readByPhone,
    read
  };