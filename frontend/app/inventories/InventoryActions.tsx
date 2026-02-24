"use client";

import { useState } from "react";
import { getToken } from "@/src/lib/auth";
import { useRouter } from "next/navigation";

interface Props {
  type: "create" | "update" | "delete";
  id?: number;
  defaultData?: {
    name: string;
    description: string;
    categoryId: number;
  };
}

export default function InventoryActions({ type, id, defaultData }: Props) {
  const token = getToken();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: defaultData?.name || "",
    description: defaultData?.description || "",
    categoryId: defaultData?.categoryId?.toString() || "",
    initialStock: "",
  });

  const handleCreate = async () => {
    if (!form.name.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/inventories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            categoryId: Number(form.categoryId),
            initialStock: Number(form.initialStock),
          }),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Create failed");
        return;
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/inventories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Delete failed");
        return;
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 text-sm mt-2 hover:text-red-400 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
