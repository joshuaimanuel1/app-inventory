const express = require("express");
const app = express();

const logger = require("./middlewares/logger");

const categoryRoutes = require("./routes/categoryRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const stockRoutes = require("./routes/stockRoutes");
const stockHistoryRoutes = require("./routes/stockHistoryRoutes");

//global middlewares
app.use(express.json());

app.use(logger);

//routes
app.use("/api/categories", categoryRoutes);

app.use("/api/inventories", inventoryRoutes);

app.use("/api/stocks", stockRoutes);

app.use("/api/stock-histories", stockHistoryRoutes);

module.exports = app;
