import { z } from "zod";

//schema for creating inventory
export const createInventorySchema = z.object({
  name: z
    .string()
    .min(1, "Inventory name is required")
    .max(50, "Inventory name max 50 characters"),

  description: z.string().max(200, "Description max 200 characters").optional(),

  categoryId: z
    .number()
    .int("categoryId must be integer")
    .positive("categoryId must be positive"),

  initialStock: z
    .number()
    .int("Initial stock must be integer")
    .min(0, "Initial stock cannot be negative")
    .optional(),
});

//schema for updating inventory
export const updateInventorySchema = z.object({
  name: z
    .string()
    .min(1, "Inventory name cannot be empty")
    .max(50, "Inventory name max 50 characters")
    .optional(),

  description: z.string().max(200, "Description max 200 characters").optional(),

  categoryId: z
    .number()
    .int("categoryId must be integer")
    .positive("categoryId must be positive")
    .optional(),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
