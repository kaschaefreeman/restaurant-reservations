/**
 * Validation middleware that checks the body of a request to ensure it does not have properties not explicity listed by an array of valid properties
 * @param  {Array} properties Array of property names that are valid for a specific instance in a database
 * @returns 
 */

function hasValidProperties(VALID_PROPERTIES) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    try {
      //Filter through the keys of request body data and create a new array of fields not listed as valid
      const invalidFields = Object.keys(data).filter(
        (field) => !VALID_PROPERTIES.includes(field)
      );
      //If the invalid fields array has properties not listed, throw an error including all non valid fields
      if (invalidFields.length) {
        const error = new Error(`Invalid field(s): ${invalidFields.join(",")}`);
        error.status = 400;
        throw error;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = hasValidProperties;
