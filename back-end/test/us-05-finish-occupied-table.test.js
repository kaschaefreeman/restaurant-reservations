const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");

describe("US-05 - Finish an occupied table", () => {
  beforeAll(() => {
    return knex.migrate
      .forceFreeMigrationsLock()
      .then(() => knex.migrate.rollback(null, true))
      .then(() => knex.migrate.latest());
  });

  beforeEach(() => {
    return knex.seed.run();
  });

  afterAll(async () => {
    return await knex.migrate.rollback(null, true).then(() => knex.destroy());
  });

  describe("DELETE /tables/:table_id/seat", () => {
    let barTableOne;
    let tableOne;

    beforeEach(async () => {
      barTableOne = await knex("tables").where("table_name", "Bar #1").first();
      tableOne = await knex("tables").where("table_name", "#1").first();
    });

    test("returns 404 for non-existent table_id", async () => {

      const csrfResponse = await request(app)
        .get("/csrf")
        .set("Accept", "application/json")

      const response = await request(app)
        .delete("/tables/99/seat")
        .set("Accept", "application/json")
        .set('x-csrf-token', csrfResponse.body.data)
        .set('Cookie', csrfResponse.headers['set-cookie'])
        .send({ datum: {} });

      expect(response.body.error).toContain("99");
      expect(response.status).toBe(404);
    });

    test("returns 400 if table_id is not occupied.", async () => {
      const csrfResponse = await request(app)
        .get("/csrf")
        .set("Accept", "application/json")

      const response = await request(app)
        .delete("/tables/1/seat")
        .set("Accept", "application/json")
        .set('x-csrf-token', csrfResponse.body.data)
        .set('Cookie', csrfResponse.headers['set-cookie'])
        .send({});

      expect(response.body.error).toContain("not occupied");
      expect(response.status).toBe(400);
    });

    test("returns 200 if table_id is occupied ", async () => {
      expect(tableOne).not.toBeUndefined();

      let csrfResponse = await request(app)
        .get("/csrf")
        .set("Accept", "application/json")

      const seatResponse = await request(app)
        .put(`/tables/${tableOne.table_id}/seat`)
        .set("Accept", "application/json")
        .set('x-csrf-token', csrfResponse.body.data)
        .set('Cookie', csrfResponse.headers['set-cookie'])
        .send({ data: { reservation_id: 1 } });

      expect(seatResponse.body.error).toBeUndefined();
      expect(seatResponse.status).toBe(200);

      csrfResponse = await request(app)
        .get("/csrf")
        .set("Accept", "application/json")

      const finishResponse = await request(app)
        .delete(`/tables/${tableOne.table_id}/seat`)
        .set("Accept", "application/json")
        .set('x-csrf-token', csrfResponse.body.data)
        .set('Cookie', csrfResponse.headers['set-cookie'])

      expect(finishResponse.body.error).toBeUndefined();
      expect(finishResponse.status).toBe(200);
    });
  });
});
