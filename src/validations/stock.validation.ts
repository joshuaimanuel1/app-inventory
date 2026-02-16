import { z } from "zod";

export const stockTypeEnum = z.enum(["INCREMENT", "DECREMENT"]);

//schema: Update stock
//POST /api/stocks
export const updateStockSchema = z.object({
  inventoryId: z
    .number()
    .int({ message: "Inventory ID must be integer" })
    .positive({ message: "Inventory ID must be positive" }),

  amount: z
    .number()
    .int({ message: "Amount must be integer" })
    .positive({ message: "Amount must be greater than 0" }),

  type: stockTypeEnum,
});

export type UpdateStockInput = z.infer<typeof updateStockSchema>;
