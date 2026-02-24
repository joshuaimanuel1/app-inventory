"use client";

import { useState } from "react";
import { getToken } from "@/src/lib/auth";
import { useRouter } from "next/navigation";

interface Props {
  type: "create" | "update" | "delete";
  id?: number;
  defaultName?: string;
}

export default function CategoryActions({ type, id, defaultName }: Props) {
  const [name, setName] = useState(defaultName || "");
  const token = getToken();
  const router = useRouter();

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

    setName("");
    router.refresh();
  };

  const handleUpdate = async () => {
    if (!id || !name.trim()) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    router.refresh();
  };

  const handleDelete = async () => {
    if (!id) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    router.refresh();
  };

  if (type === "create") {
    return (
      <div className="flex gap-2 mb-6">
        <input
          value={name}
          placeholder="New Category"
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    );
  }

  if (type === "update") {
    return (
      <div className="flex gap-2 mt-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
        />
        <button
          onClick={handleUpdate}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-7000"
        >
          Update
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 text-sm mt-2 hover:text-red-400"
    >
      Delete
    </button>
  );
}
