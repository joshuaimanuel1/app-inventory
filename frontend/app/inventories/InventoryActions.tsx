"use client";

import { useState } from "react";
import { getToken } from "@/src/lib/auth";

interface Props {
  type: "create" | "delete";
  id?: number;
}

export default function InventoryActions({ type, id }: Props) {
  const token = getToken();

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    initialStock: "",
  });

  const handleCreate = async () => {
    if (!form.name.trim()) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        categoryId: Number(form.categoryId),
        initialStock: Number(form.initialStock),
      }),
    });

    window.location.reload();
  };

  const handleDelete = async () => {
    if (!id) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    window.location.reload();
  };

  if (type === "create") {
    return (
      <div className="flex gap-2 mb-6">
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-2 py-1 bg-gray-800 border border-gray-700"
        />
        <input
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="px-2 py-1 bg-gray-800 border border-gray-700"
        />
        <input
          placeholder="Category ID"
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="px-2 py-1 bg-gray-800 border border-gray-700"
        />
        <input
          placeholder="Initial Stock"
          onChange={(e) => setForm({ ...form, initialStock: e.target.value })}
          className="px-2 py-1 bg-gray-800 border border-gray-700"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-md text-sm hover:from-blue-600 hover:to-indigo-700 transition duration-200 ease-in-out shadow-md"
        >
          Create
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleDelete} className="text-red-500 text-sm mt-2">
      Delete
    </button>
  );
}
