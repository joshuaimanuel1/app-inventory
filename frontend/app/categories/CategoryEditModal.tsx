"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// schema
const schema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Minimum 2 characters")
    .max(50, "Maximum 50 characters"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  id: number;
  defaultName: string;
}

export default function CategoryEditModal({ id, defaultName }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultName,
    },
  });

  const loading = form.formState.isSubmitting;

  useEffect(() => {
    if (open) {
      form.reset({
        name: defaultName,
      });
    }
  }, [open, defaultName, form]);

  async function onSubmit(values: FormValues) {
    try {
      await apiFetch(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });

      toast.success("Success", {
        description: "Category updated successfully",
      });

      setOpen(false);

      router.refresh();
    } catch (error: any) {
      console.error(error);

      //tankap error dari backend
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update category";

      toast.error("Error", {
        description: errorMessage,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="absolute top-3 right-3 p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/25 hover:text-blue-300 transition-all duration-200"
          aria-label="Edit Category"
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

      <DialogContent className="bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
