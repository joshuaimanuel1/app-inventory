import { Request, Response, NextFunction } from "express";
import response from "../utils/response";

const validateStock = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { inventoryId, amount, type } = req.body;

  if (!inventoryId || typeof inventoryId !== "number") {
    response.error(res, "inventoryId must be number", 400);
    return;
  }

  if (!amount || typeof amount !== "number" || amount <= 0) {
    response.error(res, "amount must be positive number", 400);
    return;
  }

  if (!["INCREMENT", "DECREMENT"].includes(type)) {
    response.error(res, "type must be INCREMENT or DECREMENT", 400);
    return;
  }

  next();
};

export default validateStock;
