import { Router } from "express";

import {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../controllers/inventoryController";

import validate from "../middlewares/validate";

import {
  createInventorySchema,
  updateInventorySchema,
} from "../validations/inventory.validation";

const router: Router = Router();

//GET /api/inventories
//get all inventory with pagination, sorting, filtering
router.get("/", getAllInventory);

//GET /api/inventories/:id
router.get("/:id", getInventoryById);

//POST /api/inventories
router.post("/", validate(createInventorySchema), createInventory);

//PUT /api/inventories/:id
router.put("/:id", validate(updateInventorySchema), updateInventory);

//DELETE /api/inventories/:id
router.delete("/:id", deleteInventory);

export default router;
