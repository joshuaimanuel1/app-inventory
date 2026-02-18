import { Router } from "express";
import { Role } from "@prisma/client";

import authMiddleware from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import validate from "../middlewares/validate";

import { updateStockSchema } from "../validations/stock.validation";

import { updateStock } from "../controllers/stockController";

const router = Router();

//update stock ADMIN ONLY
router.post(
  "/",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  validate(updateStockSchema),
  updateStock,
);

export default router;
