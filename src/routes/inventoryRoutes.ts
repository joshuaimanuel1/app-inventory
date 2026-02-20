import { Router } from "express";
import { Role } from "@prisma/client";

import authMiddleware from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import validate from "../middlewares/validate";

import {
  createInventorySchema,
  updateInventorySchema,
} from "../validations/inventory.validation";

import {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../controllers/inventoryController";

const router = Router();

//GET /api/inventory ADMIN & USER
router.get("/", getAllInventory);

router.get("/:id", getInventoryById);

//create inventory ADMIN ONLY
router.post(
  "/",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  validate(createInventorySchema),
  createInventory,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  validate(updateInventorySchema),
  updateInventory,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  deleteInventory,
);

export default router;
