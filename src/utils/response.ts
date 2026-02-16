import { Response } from "express";

const success = (
  res: Response,
  data: unknown,
  message = "Success",
  status = 200,
): Response => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

const error = (
  res: Response,
  message = "Internal Server Error",
  status = 500,
): Response => {
  return res.status(status).json({
    success: false,
    message,
  });
};

export default {
  success,
  error,
};
