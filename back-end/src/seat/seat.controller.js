const service = require("./seat.service");
const hasProperties = require("../errors/hasProperties");
const hasValidProperties = require("../errors/hasValidProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/*****VALIDATES PROPERTIES OF REQ BODY FOR PUT ENDPOINT*****/
const hasValidFields = hasValidProperties("reservation_id");
const hasRequiredProperties = hasProperties("reservation_id");
/*************************************************************/

/*****************VERIFY TABLE WITH RESERVATION INFO**********/
/*****************TABLE INFO IS STORED RES.LOCALS*************/
//Read the reservation
//Used to check the reservation id is valid before updating the table with the reservation id
async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await service.readReservationId(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `Reservation ${reservation_id} does not exist`,
    });
  }
}
//Check table does not already have a reservation before
//Used to check if the table already has a reservation assigned before adding a new reservation id
function checkOccupiedBeforeSeating(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (reservation_id) {
    next({ status: 400, message: "Table is occupied" });
  } else {
    next();
  }
}

//Check table capacity will fit people in reservation
function checkCapacity(req, res, next) {
  const { table, reservation } = res.locals;
  table.capacity < reservation.people
    ? next({
        status: 400,
        message: `A reservation for people of ${reservation.people} is too large for table capacity of ${table.capacity}`,
      })
    : next();
}

function reservationIsNotSeated(req, res, next) {
  const { status } = res.locals.reservation;
  status !== "seated"
    ? next()
    : next({ status: 400, message: "reservation is already seated" });
}
/***************************************************************/

/**
 * Update handler for tables resources
 */
async function update(req, res, next) {
  const { reservation_id } = req.body.data;
  const updatedTable = {
    ...res.locals.table,
    reservation_id,
  };
  const data = await service.seatReservationAtTable(
    updatedTable,
    reservation_id
  );
  res.status(200).json({ data });
}

/*************************************DELETE FUNCTIONS******************************************/
//Delete Validation Middleware
//Check if the table is occupied before marking it finished
//Will be used to validate table has a reservation id before removing the reservation id from the table
function checkTableOccupiedBeforeFinish(req, res, next) {
  const { reservation_id } = res.locals.table;
  reservation_id
    ? next()
    : next({ status: 400, message: "Table is not occupied" });
}
/**
 * Delete handler for tables resources.
 * Deletes reservation id from table
 */
async function finishSeat(req, res, next) {
  const { table_id, reservation_id } = res.locals.table;
  const data = await service.finishSeatReservation(table_id, reservation_id);
  res.status(200).json({ data });
}
/************************************************************************************************/

module.exports = {
  update: [
    hasValidFields,
    hasRequiredProperties,
    asyncErrorBoundary(reservationExists),
    reservationIsNotSeated,
    checkOccupiedBeforeSeating,
    checkCapacity,
    asyncErrorBoundary(update),
  ],
  delete: [checkTableOccupiedBeforeFinish, asyncErrorBoundary(finishSeat)],
};
