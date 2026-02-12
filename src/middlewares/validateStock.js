const response = require("../utils/response");

const validateStock = (req, res, next) => {
  const { inventoryId, amount, type } = req.body;

  if (!inventoryId || !amount || !type) {
    return response.error(
      res,
      "inventoryId, amount, and type are required",
      400,
    );
  }

  if (typeof inventoryId !== "number") {
    return response.error(res, "inventoryId must be number", 400);
  }

  if (amount <= 0) {
    return response.error(res, "amount must be greater than 0", 400);
  }

  if (!["INCREMENT", "DECREMENT"].includes(type)) {
    return response.error(res, "type must be INCREMENT or DECREMENT", 400);
  }

  next();
};

module.exports = validateStock;
