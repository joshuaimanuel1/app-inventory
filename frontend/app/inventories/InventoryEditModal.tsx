"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { apiFetch } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

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

//zod schema
const schema = z.object({
  name: z
    .string()
    .min(1, "Inventory name is required")
    .max(100, "Name too long"),

  description: z.string().max(255, "Description too long").optional(),

  categoryId: z.number().min(1, "Category is required"),
});

type FormValues = z.infer<typeof schema>;

//component
export default function InventoryEditModal({ id, defaultData }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  //react hook form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      name: defaultData.name,
      description: defaultData.description,
      categoryId: defaultData.categoryId,
    },
  });

  //fetch cartegories
  useEffect(() => {
    if (!open) return;

    fetchCategories();

    reset({
      name: defaultData.name,
      description: defaultData.description,
      categoryId: defaultData.categoryId,
    });
  }, [open]);

  async function fetchCategories() {
    try {
      const res = await apiFetch<{ data: Category[] }>("/api/categories");

      setCategories(res.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load categories");
    }
  }

  //submit
  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      await apiFetch(`/api/inventories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      toast.success("Inventory updated successfully");

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update inventory");
    } finally {
      setLoading(false);
    }
  };

  //render
  return (
    <>
      <button
        onClick={() => setOpen(true)}
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

      {/* modal */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Edit Inventory"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* name */}
          <div className="space-y-1">
            <Label>Inventory Name</Label>

            <Input {...register("name")} placeholder="Enter inventory name" />

            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* deskirpsi */}
          <div className="space-y-1">
            <Label>Description</Label>

            <Input
              {...register("description")}
              placeholder="Enter description"
            />

            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* category select */}
          <div className="space-y-1">
            <Label>Category</Label>

            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  value={String(field.value)}
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

            {errors.categoryId && (
              <p className="text-red-500 text-sm">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
