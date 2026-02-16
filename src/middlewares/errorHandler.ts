import { Request, Response, NextFunction } from "express";
import response from "../utils/response";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(err);

  response.error(res, err.message || "Internal Server Error", 500);
};

export default errorHandler;
