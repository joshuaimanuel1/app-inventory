import { Router } from "express";
import { Role } from "@prisma/client";

import authMiddleware from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import {
  createAdmin,
  getAllUsers,
  updateUser,
  updateUserPassword,
  deleteUser,
} from "../controllers/adminControllers";

const router = Router();

//create admin
router.post(
  "/create-admin",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  createAdmin,
);

//get all user
router.get("/users", authMiddleware, roleMiddleware(Role.ADMIN), getAllUsers);

//update user email
router.put(
  "/users/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  updateUser,
);

//update password
router.put(
  "/users/:id/password",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  updateUserPassword,
);

//delete user
router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  deleteUser,
);

export default router;
