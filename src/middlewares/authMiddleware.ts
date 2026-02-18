import { Request, Response, NextFunction } from "express";
import response from "../utils/response";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return response.error(res, "Unauthorized", 401);
    }

    const token = header.split(" ")[1];

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch {
    return response.error(res, "Invalid token", 401);
  }
};

export default authMiddleware;
