import { Category } from "@/src/lib/types/category";
import Card from "@/components/ui/Card";
import Link from "next/link";
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
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      {/* admin create only */}
      <RoleGuard allowed={["ADMIN"]}>
        <CategoryActions type="create" />
      </RoleGuard>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <Link href={`/inventories?categoryId=${category.id}`}>
              <h3 className="text-lg font-semibold cursor-pointer hover:text-blue-400">
                {category.name}
              </h3>
            </Link>

            {/* admin delete only */}
            <RoleGuard allowed={["ADMIN"]}>
              <CategoryActions type="delete" id={category.id} />
            </RoleGuard>
          </Card>
        ))}
      </div>
    </div>
  );
}
