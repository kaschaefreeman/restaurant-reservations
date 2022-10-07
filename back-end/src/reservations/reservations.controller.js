const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasValidProperties = require("../errors/hasValidProperties");

/*****VALIDATION MIDDLEWARE -- VALIDATES PROPERTIES OF REQ BODY FOR POST AND PUT ENDPOINTS*****/
//declare valid fields for reservation instance
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

//check if request body has only valid properties of reservation instance
const hasValidFields = hasValidProperties(VALID_PROPERTIES);
//Check if request body has all properties
const hasRequiredProperties = hasProperties(...VALID_PROPERTIES);

//check if people property in req body is a number
function peopleIsNumber(req, res, next) {
  const { people } = req.body.data;
  Number.isInteger(people) && people > 0
    ? next()
    : next({ status: 400, message: "people must be a number greater than 0" });
}

//check if date in req body is a valid date
function dateIsAValid(req, res, next) {
  if (Date.parse(req.body.data.reservation_date)) {
    next();
  } else {
    next({
      status: 400,
      message: "reservation_date must be a valid date string",
    });
  }
}

//check if reservation time sent in req body is a valid time
function timeIsValid(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  Date.parse(`${reservation_date}T${reservation_time}`)
    ? next()
    : next({ status: 400, message: "reservation_time must be a valid time" });
}

//check if reservation date and time sent in req body are in the future
function dateTimeIsInFuture(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const setDate = new Date(`${reservation_date}T${reservation_time}`);
  const now = new Date();
  if (setDate < now) {
    next({
      status: 400,
      message: "Reservation date must be a future date and/or time",
    });
  }
  next();
}
//Check if the reservation date in req body is not a tuesday
function dateNotOnTuesday(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const setDate = new Date(`${reservation_date}T${reservation_time}`);
  if (setDate.getDay() === 2) {
    next({ status: 400, message: "Restaurant is closed on Tuesdays" });
  }
  next();
}
//Check reservation time in the req body is not before 10:30 AM, when the restaurant opens
function timeIsNotBeforeOpen(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const setDate = new Date(`${reservation_date}T${reservation_time}`);
  const openTime = new Date(`${reservation_date}T10:30`);
  if (setDate < openTime) {
    next({ status: 400, message: "Reservation must be placed after 10:30 AM" });
  }
  next();
}
//Check reservation time in the req body is not after 9:30 PM, 60 MIN before restaurant closes
function timeIsBeforeClose(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const setDate = new Date(`${reservation_date}T${reservation_time}`);
  const closeTime = new Date(`${reservation_date}T21:30`);
  if (setDate > closeTime) {
    next({
      status: 400,
      message: "Reservation must be placed before 09:30 PM",
    });
  }
  next();
}
/**************************************************************************************************/

/**
 * Read validation middleware.
 * Checks if a reservation instance exists given a reservation Id
 */
async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `Reservation ${req.params.reservationId} does not exist`,
    });
  }
}
/***********************************CRUDL FUNCTIONS**************************************************/
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  const reservations = await service.listReservationsByDate(date);
  res.status(200).json({ data: reservations });
}
/**
 * Create handler for reservation resources
 */
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}
/**
 * Read handler for reservation resources
 */
async function read(req, res) {
  const { reservation: data } = res.locals;
  res.status(200).json({ data });
}
/**
 * Update handler for reservation resources
 */
async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.status(201).json({ data });
}
/**************************************************************************************************/

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    hasValidFields,
    hasRequiredProperties,
    peopleIsNumber,
    dateIsAValid,
    timeIsValid,
    dateTimeIsInFuture,
    dateNotOnTuesday,
    timeIsNotBeforeOpen,
    timeIsBeforeClose,
    asyncErrorBoundary(update),
  ],
  create: [
    hasValidFields,
    hasRequiredProperties,
    peopleIsNumber,
    dateIsAValid,
    timeIsValid,
    dateTimeIsInFuture,
    dateNotOnTuesday,
    timeIsNotBeforeOpen,
    timeIsBeforeClose,
    asyncErrorBoundary(create),
  ],
};
