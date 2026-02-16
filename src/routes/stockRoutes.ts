import { Router } from "express";

import { updateStock } from "../controllers/stockController";

import validate from "../middlewares/validate";

import { updateStockSchema } from "../validations/stock.validation";

const router: Router = Router();

//POST /api/stocks
router.post("/", validate(updateStockSchema), updateStock);

export default router;
