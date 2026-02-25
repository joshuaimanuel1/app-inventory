"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { apiFetch } from "@/src/lib/api";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Props {
  type: "create" | "delete";
  id?: number;
  defaultData?: {
    name: string;
    description: string;
    categoryId: number;
  };
}

export default function InventoryActions({ type, id, defaultData }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: defaultData?.name || "",
    description: defaultData?.description || "",
    categoryId: defaultData?.categoryId?.toString() || "",
    initialStock: "",
  });

  //create inventoty
  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error("Inventory name is required");
      return;
    }

    if (!form.categoryId) {
      toast.error("Category is required");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/api/inventories", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          categoryId: Number(form.categoryId),
          initialStock: Number(form.initialStock || 0),
        }),
      });

      toast.success("Inventory created successfully");

      setForm({
        name: "",
        description: "",
        categoryId: "",
        initialStock: "",
      });

      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create inventory");
    } finally {
      setLoading(false);
    }
  };

  //delete inventory (with confirmation)
  const handleDelete = async () => {
    if (!id) return;

    try {
      setLoading(true);

      await apiFetch(`/api/inventories/${id}`, {
        method: "DELETE",
      });

      toast.success("Inventory deleted successfully");

      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete inventory");
    } finally {
      setLoading(false);
    }
  };

  if (type === "create") {
    return (
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={form.name}
          placeholder="Inventory name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:border-blue-500"
        />

        <input
          value={form.description}
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
        />

        <input
          value={form.categoryId}
          placeholder="Category ID"
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
        />

        <input
          value={form.initialStock}
          placeholder="Initial stock"
          onChange={(e) => setForm({ ...form, initialStock: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
        />

        <Button onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    );
  }

  //delete (with conformation dialog)
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={loading}
          className="text-red-500 text-sm mt-2 hover:text-red-400 transition disabled:opacity-50"
        >
          Delete
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-gray-900 border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Inventory?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone.
            <br />
            This will permanently delete this inventory and its stock history.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
