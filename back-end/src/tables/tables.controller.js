const service = require("./table.service");
const hasProperties = require("../errors/hasProperties");
const hasValidProperties = require("../errors/hasValidProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/*****VALIDATION MIDDLEWARE -- VALIDATES PROPERTIES OF REQ BODY FOR POST ENDPOINT*****/
const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];
const requiredProperties = ["table_name", "capacity"];

/* Check Request body has valid properties */
const hasValidFields = hasValidProperties(VALID_PROPERTIES);

/*Check Request body has all properties */
const hasRequiredProperties = hasProperties(...requiredProperties);

/*Check table name is at least 2 characters long */
function tableNameIsValid(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2) {
    next({
      status: 400,
      message: "table_name must be at least 2 characters long",
    });
  }
  next();
}
//Check capacity is a number and not a string
function capacityIsANumber(req, res, next) {
  const { capacity } = req.body.data;
  if (typeof capacity === "string") {
    next({ status: 400, message: "capacity must be a number greater than 0" });
  }
  next();
}

/*Check capacity is at least 1 seat */
function capacityIsGreaterThanZero(req, res, next) {
  const { capacity } = req.body.data;
  if (capacity < 1) {
    next({ status: 400, message: "Table capacity must be at least 1" });
  }
  next();
}
/***********************************************************************************/
/**
 * Read handler for tables resources.
 * Stores table data to res.locals to be accessed in the seat router
 * Needed to validate table exists before using the seat router to update the table with the reservation id
 */
async function tableExists(req, res, next) {
  const table = await service.read(req.params.tableId);
  if (table) {
    res.locals.table = table;
    next();
  } else {
    next({
      status: 404,
      message: `Table id ${req.params.tableId} does not exist`,
    });
  }
}
/**
 * List handler for tables resources
 */
async function list(req, res, next) {
  const data = await service.list();
  res.status(200).json({ data });
}

/**
 * Create handler for tables resources
 */
async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasValidFields,
    hasRequiredProperties,
    tableNameIsValid,
    capacityIsANumber,
    capacityIsGreaterThanZero,
    asyncErrorBoundary(create),
  ],
  tableExists: asyncErrorBoundary(tableExists),
};
