const responseHandler = function(response, bool, status, returnObject) {
  response.status(status).json({
    success: bool,
    ...returnObject,
  });
};

module.exports = responseHandler;
