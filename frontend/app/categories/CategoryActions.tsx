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
  type: "create" | "update" | "delete";
  id?: number;
  defaultName?: string;
}

export default function CategoryActions({ type, id, defaultName }: Props) {
  const router = useRouter();

  const [name, setName] = useState(defaultName || "");
  const [loading, setLoading] = useState(false);

  //create
  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/api/categories", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      toast.success("Category created");

      setName("");

      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  //update
  const handleUpdate = async () => {
    if (!id) return;

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      await apiFetch(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });

      toast.success("Category updated");

      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  //delete (with confirmation)
  const handleDelete = async () => {
    if (!id) return;

    try {
      setLoading(true);

      await apiFetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      toast.success("Category deleted");

      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  if (type === "create") {
    return (
      <div className="flex gap-3 mb-6">
        <input
          value={name}
          placeholder="New category name..."
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:border-blue-500"
        />

        <Button onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    );
  }

  //update
  if (type === "update") {
    return (
      <div className="flex gap-2 mt-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
        />

        <Button onClick={handleUpdate} disabled={loading} size="sm">
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    );
  }

  //delete (with conformation dialog)
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/25 hover:text-red-300 transition-all duration-200"
          aria-label="Delete Category"
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

      <AlertDialogContent className="bg-gray-900 border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category?</AlertDialogTitle>

          <AlertDialogDescription className="text-gray-400">
            This action cannot be undone.
            <br />
            This will permanently delete this category.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-gray-700 hover:bg-gray-800 text-white">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
