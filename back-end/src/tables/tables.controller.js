const service = require("./table.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/*****VALIDATION MIDDLEWARE -- VALIDATES PROPERTIES OF REQ BODY FOR POST ENDPOINT*****/
const VALID_PROPERTIES = ["table_name", "capacity"];

/* Check Request body has valid properties */
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

/*Check Request body has all properties */
const hasRequiredProperties = hasProperties(...VALID_PROPERTIES);

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
function capacityIsANumber(req,res,next){
  const {capacity} = req.body.data
  if (typeof capacity === 'string'){
    next({status:400, message: "capacity must be a number greater than 0"})
  }
  next()
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
 * List handler for tables resources
 */
async function list(req,res,next){
    const data = await service.list()
    res.status(200).json({data})
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
    hasValidProperties,
    hasRequiredProperties,
    tableNameIsValid,
    capacityIsANumber,
    capacityIsGreaterThanZero,
    asyncErrorBoundary(create),
  ],
};
