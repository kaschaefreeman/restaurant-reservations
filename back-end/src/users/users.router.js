const passport = require("passport");
require("../utils/JWT/passport-config")

/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const methodNotAllowed = require("../errors/methodNotAllowed");

const router = require("express").Router();
const controller = require("./users.controller");

router
  .route("/login")
  .post(controller.login)

router
  .route('/logout')
  .delete(passport.authenticate('jwt', { session: false, failWithError: true }), controller.logout)

router
  .route('/isAuthorized')
  .get(passport.authenticate('jwt', { session: false, failWithError: true }),controller.isAuthorized)

router
  .route("/:user_id")
  .get(passport.authenticate('jwt', { session: false, failWithError: true }), controller.read)

router
  .route("/")
  .get(passport.authenticate('jwt', { session: false }), controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
