import { Category } from "@/src/lib/types/category";
import Card from "@/components/ui/Card";
import Link from "next/link";

import CategoryEditModal from "./CategoryEditModal";
import CategoryCreateModal from "./CategoryCreateModal";
import CategoryActions from "./CategoryActions";

import RoleGuard from "@/components/auth/RoleGuard";

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
    cache: "no-store",
  });

  const result = await res.json();
  return result.data;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      {/* header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>

        <RoleGuard allowed={["ADMIN"]}>
          <CategoryCreateModal />
        </RoleGuard>
      </div>

      {/* grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="relative group p-6">
            <RoleGuard allowed={["ADMIN"]}>
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <CategoryEditModal
                  id={category.id}
                  defaultName={category.name}
                />
                <CategoryActions type="delete" id={category.id} />
              </div>
            </RoleGuard>

            {/* name */}
            <Link href={`/inventories?categoryId=${category.id}`}>
              <h3 className="text-lg font-semibold cursor-pointer hover:text-blue-400 transition mt-2 pr-16">
                {category.name}
              </h3>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
