export interface StockHistory {
  id: number;
  inventoryId: number;
  amount: number;
  type: "INCREMENT" | "DECREMENT";
  date: string;
  inventory: {
    id: number;
    name: string;
    stock: number;
  };
}
