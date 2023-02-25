
exports.up = function(knex) {
   return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
};

exports.down = function(knex) {
    return knex.schema.raw('DROP EXTENSION "uuid-ossp"').catch((error)=>console.log("Unable to drop extension on Knex migrate:rollback\n", error.message))
  
};
