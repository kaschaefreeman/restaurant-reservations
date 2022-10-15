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
  "status",
  "reservation_id",
  "updated_at",
  "created_at",
];

const requiredProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

//check if request body has only valid properties of reservation instance
//used to validate body properties when creating and updating a reservation instance
const hasValidFields = hasValidProperties(VALID_PROPERTIES);
//Check if request body has all properties
const hasRequiredProperties = hasProperties(...requiredProperties);

//check if people property in req body is a number
//used to validate body properties when creating and updating a reservation instance
function peopleIsNumber(req, res, next) {
  const { people } = req.body.data;
  Number.isInteger(people) && people > 0
    ? next()
    : next({ status: 400, message: "people must be a number greater than 0" });
}

//check if date in req body is a valid date
//used to validate body properties when creating and updating a reservation instance
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
//used to validate body properties when creating and updating a reservation instance
function timeIsValid(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  Date.parse(`${reservation_date}T${reservation_time}`)
    ? next()
    : next({ status: 400, message: "reservation_time must be a valid time" });
}

//check if reservation date and time sent in req body are in the future
//used to validate body properties when creating and updating a reservation instance
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
//used to validate body properties when creating and updating a reservation instance
function dateNotOnTuesday(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const setDate = new Date(`${reservation_date}T${reservation_time}`);
  if (setDate.getDay() === 2) {
    next({ status: 400, message: "Restaurant is closed on Tuesdays" });
  }
  next();
}
//Check reservation time in the req body is not before 10:30 AM, when the restaurant opens
//used to validate body properties when creating and updating a reservation instance
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
//used to validate body properties when creating and updating a reservation instance
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

//Ensure a new reservation is only created with status of booked
//used to validate body properties when creating a reservation instance
function statusIsBooked(req, res, next) {
  const { status } = req.body.data;
  !status || (status && status == "booked")
    ? next()
    : next({
        status: 400,
        message: `A new reservation may not have status of ${status}`,
      });
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
  const { date, mobile_number } = req.query;
  let data;
  if (date) {
    data = await service.listReservationsByDate(date);
  } else if (mobile_number) {
    data = await service.searchByMobileNumber(mobile_number);
  } else {
    res.status(400).json({
      error: "Reservations may only be listed by date or mobile_number query",
    });
  }
  res.status(200).json({ data });
}
/**
 * Create handler for reservation resources
 */
async function create(req, res) {
  const newReservation = {
    ...req.body.data,
    status: "booked",
  };
  const data = await service.create(newReservation);
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
  res.status(200).json({ data });
}

/***********MIDDLEWARE USED TO UPDATE STATUS ON A RESERVATION BY ID****************/

/*To be used on /reservations/:reservationId/status route */

/********************************
* VALIDATION MIDDLEWARE 
/********************************/

//declare status that are valid for a reservations
const validStatus = ["booked", "seated", "finished", "cancelled"];

//check if it is a valid status
function statusIsValid(req, res, next) {
  const { status } = req.body.data;
  validStatus.includes(status)
    ? next()
    : next({ status: 400, message: `Invalid status: ${status}` });
}

//Check if the status is not Finished.
//Used when updating a reservations.  Can not update a reservation that is finished
function statusIsNotFinished(req, res, next) {
  const { status } = res.locals.reservation;
  status === "finished"
    ? next({
        status: 400,
        message: "Can not update reservations with status 'finished'",
      })
    : next();
}
/********************************
* UPDATE STATUS HANDLER 
/********************************/
async function updateStatus(req, res) {
  const { status } = req.body.data;
  const { reservation_id } = res.locals.reservation;
  const data = await service.updateStatus(reservation_id, status);
  res.status(200).json({ data });
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
    statusIsBooked,
    asyncErrorBoundary(create),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    statusIsValid,
    statusIsNotFinished,
    asyncErrorBoundary(updateStatus),
  ],
};
