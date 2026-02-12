const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");

const validateStock = require("../middlewares/validateStock");

//POST /api/stocks
router.post("/", validateStock, stockController.updateStock);

module.exports = router;
