import express, { Application } from "express";
import cors from "cors";

import logger from "./middlewares/logger";

import categoryRoutes from "./routes/categoryRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import stockRoutes from "./routes/stockRoutes";
import stockHistoryRoutes from "./routes/stockHistoryRoutes";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(logger);

app.use("/api/categories", categoryRoutes);
app.use("/api/inventories", inventoryRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/stock-histories", stockHistoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

export default app;
