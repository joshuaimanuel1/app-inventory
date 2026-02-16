import express, { Application } from "express";

import logger from "./middlewares/logger";

import categoryRoutes from "./routes/categoryRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import stockRoutes from "./routes/stockRoutes";
import stockHistoryRoutes from "./routes/stockHistoryRoutes";

const app: Application = express();

//middlewares
app.use(express.json());

app.use(logger);

//routes
app.use("/api/categories", categoryRoutes);

app.use("/api/inventories", inventoryRoutes);

app.use("/api/stocks", stockRoutes);

app.use("/api/stock-histories", stockHistoryRoutes);

//export app
export default app;
