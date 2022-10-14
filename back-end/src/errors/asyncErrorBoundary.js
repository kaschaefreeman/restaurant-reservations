/**Higher order async error handling function that will resolve the promise in the delegate
 * Any errors will be caught and passed to next with the error status and message.
 * Will be used to wrap around async/await middleware functions to pass error to next
 * @param delegate async/await handler or middleware function. This function will be called by the asyncErrorBoundary
 * @param defaultStatus optional parameter that allows you to override the status code returned when delegate throws an error
 * @returns Express handler or middleware function, which is eventually called by Express in place of the delegate function
 */
function asyncErrorBoundary(delegate, defaultStatus) {
  return (request, response, next) => {
    Promise.resolve()
      .then(() => delegate(request, response, next))
      .catch((error = {}) => {
        const { status = defaultStatus, message = error } = error;
        next({
          status,
          message,
        });
      });
  };
}

module.exports = asyncErrorBoundary;
