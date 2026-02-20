import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import response from "../utils/response";

export const roleMiddleware = (requiredRole: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return response.error(res, "Unauthorized", 401);
    }

    if (user.role !== requiredRole) {
      return response.error(res, "Forbidden: insufficient role", 403);
    }

    next();
  };
};
