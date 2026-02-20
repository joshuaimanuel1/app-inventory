import { Inventory } from "../../frontend/src/lib/types/inventory";

const BASE_URL = "http://localhost:5000/api";

export const fetchInventories = async (): Promise<Inventory[]> => {
  const response = await fetch(`${BASE_URL}/inventories`);

  if (!response.ok) {
    throw new Error("Failed to fetch inventories");
  }

  const result = await response.json();
  return result.data;
};
