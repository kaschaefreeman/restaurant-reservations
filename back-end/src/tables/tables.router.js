/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
 const methodNotAllowed = require("../errors/methodNotAllowed");
 const router = require("express").Router();
 const seatRouter = require('../seat/seat.router')
 const controller = require("./tables.controller");
 
 router
   .route("/")
   .get(controller.list)
   .post(controller.create)
   .all(methodNotAllowed);
 router
   .use('/:tableId/seat', controller.tableExists, seatRouter)

 
 module.exports = router;
  