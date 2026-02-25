"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

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
  onSuccess?: () => void;
}

export default function CategoryCreateModal({ onSuccess }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const loading = form.formState.isSubmitting;

  // reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset({ name: "" });
    }
  }, [open, form]);

  // submit
  async function onSubmit(values: FormValues) {
    try {
      await apiFetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(values),
      });

      toast.success("Success", {
        description: "Category created successfully",
      });

      setOpen(false);

      onSuccess?.();

      router.refresh();
    } catch (error: any) {
      console.error(error);

      //tangkap error dari backedn ambil properti message jika ada
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create category";

      toast.error("Error", {
        description: errorMessage,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Create Category</Button>
      </DialogTrigger>

      <DialogContent className="bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
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
                    <Input placeholder="Electronics" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
