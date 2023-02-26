const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");
const { genPassword } = require("../src/utils/password-utils");

describe("US-09 - Test Users Login and CSRF/JWT Authentification", () => {
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


  describe("GET /csrf", () => {
    test("returns the csrf token", async () => {
      const response = await request(app)
        .get('/csrf')
        .set("Accept", "application/json")

      expect(response.status).toBe(200)
      expect(response.body.data).toBeTruthy()
    })
    test("sends a cookie name csrfToken within the response", async () => {
      const response = await request(app)
        .get('/csrf')

      /** Read response header of Set-Cookie to see if it includes a given text property */
      const cookieHasProperty = (property) => {
        return response.headers['set-cookie'][0].includes(property)
      }

      expect(cookieHasProperty('csrfToken')).toBeTruthy()
      expect(cookieHasProperty('Max-Age=86400')).toBeTruthy()
      expect(cookieHasProperty('HttpOnly')).toBeTruthy()
      expect(cookieHasProperty('Path=/')).toBeTruthy()
      expect(cookieHasProperty('Secure')).toBeTruthy()
      expect(response.status).toBe(200)
    })
  })

  describe("POST /users/login", () => {

    test("returns 403 if hashed csrf token in cookies is not sent with request and csrf token not sent in request headers", async () => {

      const user = await knex('users')
        .select("*")
        .where({ phone: '777-777-7777' })
        .first()

      const { phone } = user

      const data = { phone, password: 'admin' }

      const response = await request(app)
        .post('/users/login')
        .set("Accept", "application/json")
        .send({ data })

      expect(response.status).toBe(403)
      expect(response.body.error).toContain("csrf")
    })

    test("returns 403 if csrf token is not in request headers", async () => {
      const csrfResponse = await request(app)
        .get("/csrf")
        .set("Accept", "application/json")

        const user = await knex('users')
        .select("*")
        .where({ phone: '777-777-7777' })
        .first()

      const { phone, password } = user

      const data = { phone, password: 'admin' }

      const response = await request(app)
        .post('/users/login')
        .set("Accept", "application/json")
        .set('Cookie', [...csrfResponse.headers['set-cookie']])
        .send(data)

      expect(response.status).toBe(403)
      expect(response.body.error).toContain("csrf")
    })

    test("returns 403 if hashed csrf token in cookies is not sent with request", async () => {

      const user = await knex('users')
        .select("*")
        .where({ phone: '777-777-7777' })
        .first()

      const { phone } = user

      const data = { phone, password: 'admin' }


      const csrfResponse = await request(app)
        .get("/csrf")
        .set("Accept", "application/json")

      const response = await request(app)
        .post('/users/login')
        .set("Accept", "application/json")
        .set('x-csrf-token', csrfResponse.body.data)
        .send(data)

      expect(response.status).toBe(403)
      expect(response.body.error).toContain("csrf")
    })

    /** JWT strategy will be to send the user a JWT token in the cookies to be used for authentification of admins. 
     * 
     * JWT will be sent as an HTTPOnly cookie 
     * 
     * A mock authentification cookie will be sent to the user with their admin_id to verify that they are authenticated on the front-end
     * 
     * Both cookies will expire within 24 hours and should be provided on routes that allow the performance of admin duties and viewing admin only routes
     * 
     * (tests for admin routes and duties will be specified on test 5,6,7,and 9)
     */
    test('return 200 for VALID POST request with valid CSRF token and sends user a JSON Web Token and userId in the cookies', async () => {

      const user = await knex('users')
        .select("*")
        .where({ phone: '777-777-7777' })
        .first()

      const { phone, password } = user

      const data = { phone, password: 'admin' }

      const csrfResponse = await request(app)
        .get("/csrf")
        .set("Accept", "application/json")

      const response = await request(app)
        .post('/users/login')
        .set("Accept", "application/json")
        .set('x-csrf-token', csrfResponse.body.data)
        .set('Cookie', csrfResponse.headers['set-cookie'])
        .send({ data })

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toMatchObject(
        expect.objectContaining({
          user_id: expect.any(String),
          user_name: "JWT TEST",
          phone: "777-777-7777",
          password
        })
      );

      /** Read response header of Set-Cookie to see if it includes a given text property */
      const cookieHasProperty = (property) => {
        return response.headers['set-cookie'][0].includes(property)
      }

      expect(cookieHasProperty('jwt')).toBeTruthy()
      expect(cookieHasProperty('HttpOnly')).toBeTruthy()
      expect(cookieHasProperty('Path=/')).toBeTruthy()


      // expect(cookieHasProperty('user')).toBeTruthy()
      expect(response.status).toBe(200)
    })
  })

})