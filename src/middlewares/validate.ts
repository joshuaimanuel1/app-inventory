import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import response from "../utils/response";

const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        response.error(res, error.issues[0].message, 400);
        return;
      }

      response.error(res, "Validation failed", 400);
      return;
    }
  };

export default validate;
