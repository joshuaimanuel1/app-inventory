import { Router } from "express";
import { Role } from "@prisma/client";

import authMiddleware from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import validate from "../middlewares/validate";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation";

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

const router = Router();

//GET /api/categories ADMIN & USER
router.get("/", authMiddleware, getAllCategories);

router.get("/:id", authMiddleware, getCategoryById);

//create category ADMIN ONLY
router.post(
  "/",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  validate(createCategorySchema),
  createCategory,
);

//update category ADMIN ONLY
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  validate(updateCategorySchema),
  updateCategory,
);

//delete category ADMIN ONLY
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  deleteCategory,
);

export default router;
