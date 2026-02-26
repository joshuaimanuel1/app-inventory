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

  //create inventory
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

  //delete (with confirmation dialog)
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={loading}
          className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/25 hover:text-red-300 transition-all duration-200 disabled:opacity-50"
          aria-label="Delete Inventory"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-gray-900 border-gray-800 sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-100">
            Delete Inventory?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-gray-400">
            This action cannot be undone.
            <br />
            This will permanently delete this inventory and its stock history.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-medium rounded-md transition-colors">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors border-0"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
