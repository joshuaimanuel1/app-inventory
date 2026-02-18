import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import response from "../utils/response";

export const roleMiddleware = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};
