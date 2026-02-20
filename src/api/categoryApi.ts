import { Category } from "../../frontend/src/lib/types/category";

const BASE_URL = "http://localhost:5000/api";

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await response.json();
  return result.data;
};
