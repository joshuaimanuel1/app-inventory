import { Router } from "express";

import {
  getAllStockHistory,
  getStockHistoryByInventoryId,
} from "../controllers/stockController";

const router: Router = Router();

//GET /api/stock-histories
//get all stock history with pagnation, sorting, filtering
router.get("/", getAllStockHistory);

// GET /api/stock-histories/:inventoryId
router.get("/:inventoryId", getStockHistoryByInventoryId);

export default router;
