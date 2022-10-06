const tables = require("./00-tables.json")
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return (
    knex
      .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
      // Insert seed entries
      .then(function () {
        return knex("tables").insert(tables);
      })
  );
};
