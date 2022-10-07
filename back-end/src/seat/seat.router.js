/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const methodNotAllowed = require("../errors/methodNotAllowed");
const router = require("express").Router({ mergeParams: true });
const controller = require("./seat.controller");

router.route("/").put(controller.update).all(methodNotAllowed);

module.exports = router;
