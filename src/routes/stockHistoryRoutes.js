const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");

router.get("/", stockController.getAllStockHistory);

router.get("/:inventoryId", stockController.getStockHistoryByInventoryId);

module.exports = router;
