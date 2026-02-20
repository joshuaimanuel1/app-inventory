import { Router } from "express";

import authMiddleware from "../middlewares/authMiddleware";

import {
  getAllStockHistory,
  getStockHistoryByInventoryId,
} from "../controllers/stockController";

const router = Router();

//GET /api/stock-histories ADMIN & USER
router.get("/", getAllStockHistory);

router.get("/:inventoryId", getStockHistoryByInventoryId);

export default router;
