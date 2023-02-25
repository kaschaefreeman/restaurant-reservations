
exports.up = function(knex) {
  return knex.schema.createTable('users', (table)=>{
    table.uuid('user_id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('user_name').notNullable()
    table.string('phone').notNullable()
    table.string('password').notNullable()
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
