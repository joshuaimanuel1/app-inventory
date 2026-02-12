const response = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  return response.error(res, "Internal Server Error", 500);
};

module.exports = errorHandler;
