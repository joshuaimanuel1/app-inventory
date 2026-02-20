"use client";

import { useState } from "react";
import { getToken } from "@/src/lib/auth";

interface Props {
  type: "create" | "delete";
  id?: number;
}

export default function CategoryActions({ type, id }: Props) {
  const [name, setName] = useState("");
  const token = getToken();

  const handleCreate = async () => {
    if (!name.trim()) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    window.location.reload();
  };

  const handleDelete = async () => {
    if (!id) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
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
          placeholder="New Category"
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded"
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
