import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction): void => {
  const method = req.method;
  const url = req.originalUrl;
  const time = new Date().toISOString();

  console.log(`[${time}] ${method} ${url}`);

  next();
};

export default logger;
