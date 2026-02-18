import { Router } from "express";
import { Role } from "@prisma/client";

import authMiddleware from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { createAdmin } from "../controllers/adminControllers";

const router = Router();

//create admin ADMIN ONLY
router.post("/", authMiddleware, roleMiddleware(Role.ADMIN), createAdmin);

export default router;
