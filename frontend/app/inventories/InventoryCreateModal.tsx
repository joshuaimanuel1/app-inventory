// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import { toast } from "sonner";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import { Input } from "@/components/ui/input";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { Button } from "@/components/ui/button";

// import { useForm } from "react-hook-form";

// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { apiFetch } from "@/src/lib/api";

// //validation schema
// const createInventorySchema = z.object({
//   name: z.string().min(1, "Inventory name is required"),

//   description: z.string().optional(),

//   categoryId: z.string().min(1, "Category is required"),

//   initialStock: z.string().min(0),
// });

// type CreateInventoryInput = z.infer<typeof createInventorySchema>;

// //types
// interface Category {
//   id: number;
//   name: string;
// }

// interface Props {
//   onSuccess?: () => void;
// }

// //componets
// export default function InventoryCreateModal({ onSuccess }: Props) {
//   const router = useRouter();

//   const [open, setOpen] = useState(false);

//   const [categories, setCategories] = useState<Category[]>([]);

//   //reset hook form
//   const form = useForm<CreateInventoryInput>({
//     resolver: zodResolver(createInventorySchema),

//     defaultValues: {
//       name: "",
//       description: "",
//       categoryId: "",
//       initialStock: "0",
//     },
//   });

//   const loading = form.formState.isSubmitting;

//   //fetch categories when modal opens
//   useEffect(() => {
//     if (!open) return;

//     fetchCategories();
//   }, [open]);

//   async function fetchCategories() {
//     try {
//       const res = await apiFetch<{
//         data: Category[];
//       }>("/api/categories");

//       setCategories(res.data);
//     } catch {
//       toast.error("Failed to load categories");
//     }
//   }

//   //submit
//   async function onSubmit(values: CreateInventoryInput) {
//     try {
//       await apiFetch("/api/inventories", {
//         method: "POST",

//         body: JSON.stringify({
//           name: values.name,
//           description: values.description,

//           categoryId: Number(values.categoryId),

//           initialStock: Number(values.initialStock),
//         }),
//       });

//       toast.success("Inventory created successfully");

//       form.reset();

//       setOpen(false);

//       router.refresh();

//       onSuccess?.();
//     } catch {
//       toast.error("Failed to create inventory");
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>+ Create Inventory</Button>
//       </DialogTrigger>

//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create Inventory</DialogTitle>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             {/* NAME */}
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Inventory Name</FormLabel>

//                   <FormControl>
//                     <Input placeholder="Laptop ASUS" {...field} />
//                   </FormControl>

//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* DESCRIPTION */}
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description</FormLabel>

//                   <FormControl>
//                     <Input placeholder="Gaming laptop" {...field} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             {/* category */}
//             <FormField
//               control={form.control}
//               name="categoryId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Category</FormLabel>

//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select category" />
//                       </SelectTrigger>
//                     </FormControl>

//                     <SelectContent>
//                       {categories.map((cat) => (
//                         <SelectItem key={cat.id} value={String(cat.id)}>
//                           {cat.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* stock */}
//             <FormField
//               control={form.control}
//               name="initialStock"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Initial Stock</FormLabel>

//                   <FormControl>
//                     <Input type="number" {...field} />
//                   </FormControl>

//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* button */}
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? "Creating..." : "Create Inventory"}
//             </Button>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { apiFetch } from "@/src/lib/api";

//validation schema
const createInventorySchema = z.object({
  name: z.string().min(1, "Inventory name is required"),

  description: z.string().optional(),

  categoryId: z.string().min(1, "Category is required"),

  initialStock: z.string().min(0),
});

type CreateInventoryInput = z.infer<typeof createInventorySchema>;

//types
interface Category {
  id: number;
  name: string;
}

interface Props {
  onSuccess?: () => void;
}

//componets
export default function InventoryCreateModal({ onSuccess }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  //reset hook form
  const form = useForm<CreateInventoryInput>({
    resolver: zodResolver(createInventorySchema),

    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      initialStock: "0",
    },
  });

  const loading = form.formState.isSubmitting;

  //fetch categories when modal opens
  useEffect(() => {
    if (!open) return;

    fetchCategories();
  }, [open]);

  async function fetchCategories() {
    try {
      const res = await apiFetch<{
        data: Category[];
      }>("/api/categories");

      setCategories(res.data);
    } catch {
      toast.error("Error", {
        description: "Failed to load categories",
      });
    }
  }

  //submit
  async function onSubmit(values: CreateInventoryInput) {
    try {
      await apiFetch("/api/inventories", {
        method: "POST",

        body: JSON.stringify({
          name: values.name,
          description: values.description,

          categoryId: Number(values.categoryId),

          initialStock: Number(values.initialStock),
        }),
      });

      toast.success("Success", {
        description: "Inventory created successfully",
      });

      form.reset();

      setOpen(false);

      router.refresh();

      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create inventory";

      toast.error("Error", {
        description: errorMessage,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Create Inventory</Button>
      </DialogTrigger>

      <DialogContent className="bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>Create Inventory</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventory Name</FormLabel>

                  <FormControl>
                    <Input placeholder="Laptop ASUS" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Input placeholder="Gaming laptop" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* stock */}
            <FormField
              control={form.control}
              name="initialStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Stock</FormLabel>

                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Inventory"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
