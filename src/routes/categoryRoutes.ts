import { Router } from "express";

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

import validate from "../middlewares/validate";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation";
import { id } from "zod/v4/locales";

const router: Router = Router();

router.get("/", getAllCategories);

//GET /api/categories/:id
router.get("/:id", getCategoryById);

//POST /api/categories
router.post("/", validate(createCategorySchema), createCategory);

//PUT /api/categories/:id
router.put("/:id", validate(updateCategorySchema), updateCategory);

//DELETE /api/categories/:id
router.delete("/:id", deleteCategory);

export default router;
