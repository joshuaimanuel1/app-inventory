"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useForm, Controller } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Category {
  id: number;
  name: string;
}

interface Props {
  id: number;
  defaultData: {
    name: string;
    description: string;
    categoryId: number;
  };
}

//validation schema
const schema = z.object({
  name: z
    .string()
    .min(1, "Inventory name is required")
    .max(100, "Maximum 100 characters"),

  description: z.string().max(255, "Maximum 255 characters").optional(),

  categoryId: z.number().min(1, "Category is required"),
});

type FormValues = z.infer<typeof schema>;

export default function InventoryEditModal({ id, defaultData }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: 0,
    },
  });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiFetch<{ data: Category[] }>("/api/categories");

      setCategories(res.data || []);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to load categories",
      });
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    fetchCategories();

    form.reset({
      name: defaultData.name,
      description: defaultData.description || "",
      categoryId: defaultData.categoryId,
    });
  }, [open, defaultData, fetchCategories, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      await apiFetch(`/api/inventories/${id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });

      toast.success("Success", {
        description: "Inventory updated successfully",
      });

      setOpen(false);

      router.refresh();
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update inventory";

      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="absolute top-3 right-3 p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/25 hover:text-blue-300 transition-all duration-200"
          aria-label="Edit Inventory"
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
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </DialogTrigger>

      {/* modal */}
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>Edit Inventory</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Inventory Name</Label>

            <Input
              {...form.register("name")}
              placeholder="Enter inventory name"
            />

            {form.formState.errors.name && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Description</Label>

            <Input
              {...form.register("description")}
              placeholder="Enter description"
            />

            {form.formState.errors.description && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Category</Label>

            <Controller
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {form.formState.errors.categoryId && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.categoryId.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
