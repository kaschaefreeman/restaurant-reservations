const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  const reservations = await service.listReservationsByDate(date);
  res.status(200).json({ data: reservations });
}
/**
 * Read validation middleware
 */
async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservationId);
  if (reservation) {
    console.log(reservation, req.body);
    res.locals.reservation = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `Reservation ${req.params.reservationId} does not exist`,
    });
  }
}


/**
 * Read handler for reservation resources
 */
async function read(req, res) {
  const { reservation: data } = res.locals;
  res.status(200).json({ data });
}

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
function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  invalidFields.length
    ? next({
        status: 400,
        message: `Invalid field(s): ${invalidFields.join(",")}`,
      })
    : next();
}

const hasRequiredProperties = hasProperties(...VALID_PROPERTIES);

function peopleIsNumber(req, res, next) {
  const {people} = req.body.data
  Number.isInteger(Number(people)) && people > 0 
  ? next() 
  : next({status: 400, message: 'people must be a number greater than 0'})
}

function dateIsAValid(req,res,next){
  if(Date.parse(req.body.data.reservation_date)){
    next()
  } else{
    next({status:400, message:'reservation_date must be a valid date string'})
  }
}

function timeIsValid(req,res,next){
  const {reservation_date, reservation_time} = req.body.data
  Date.parse(`${reservation_date}T${reservation_time}`)
  ? next()
  : next({status:400, message:'reservation_time must be a valid time'})
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
/**
 * Create handler for reservation resources
 */
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    hasValidProperties,
    hasRequiredProperties,
    peopleIsNumber,
    dateIsAValid,
    timeIsValid,
    asyncErrorBoundary(update),
  ],
  create: [
    hasValidProperties,
    hasRequiredProperties,
    peopleIsNumber,
    dateIsAValid,
    timeIsValid,
    asyncErrorBoundary(create),
  ],
};
