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
