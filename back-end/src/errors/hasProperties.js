/**
 * Validation middleware that checks the body of a request for field to be listed as required
 * @param  {...any} properties string of property names to be checked if included in request body
 */
function hasProperties(...properties) {
  return function (req, res, next) {
    const missingFields = [];
    const { data = {} } = req.body;
    try {
      //loop the the property names
      properties.forEach((property) => {
        //if property name does not exists in data, push the property name to the missingFields array
        if (!data[property]) {
          missingFields.push(`A ${property} is required`);
        }
      });
      //If there are missing fields, throw an error with all missing properties
      if (missingFields.length) {
        const error = new Error(missingFields.join(", "));
        error.status = 400;
        throw error;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
module.exports = hasProperties;
