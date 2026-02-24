import { StockHistory } from "./stockHistory";

export interface Inventory {
  id: number;
  name: string;
  description: string;
  stock: number;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
}

export interface InventoryDetail extends Inventory {
  histories: StockHistory[];
}
