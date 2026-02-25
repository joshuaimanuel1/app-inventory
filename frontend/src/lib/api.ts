import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

//base fetch
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}

//category API
export const createCategory = (data: { name: string }) =>
  apiFetch("/api/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCategory = (id: number, data: { name: string }) =>
  apiFetch(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteCategory = (id: number) =>
  apiFetch(`/api/categories/${id}`, {
    method: "DELETE",
  });

//inventory API
export const createInventory = (data: { name: string; description: string }) =>
  apiFetch("/api/inventories", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateInventory = (
  id: number,
  data: {
    name: string;
    description: string;
  },
) =>
  apiFetch(`/api/inventories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteInventory = (id: number) =>
  apiFetch(`/api/inventories/${id}`, {
    method: "DELETE",
  });
