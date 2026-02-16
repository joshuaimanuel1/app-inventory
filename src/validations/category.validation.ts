import { z } from "zod";

//schema for creating category
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name max 50 characters"),
});

//schema for updating category
export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name cannot be empty")
    .max(50, "Category name max 50 characters")
    .optional(),
});
