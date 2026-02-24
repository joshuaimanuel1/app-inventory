import { Inventory } from "@/src/lib/types/inventory";
import Card from "@/components/ui/Card";
import Link from "next/link";
import InventoryActions from "./InventoryActions";
import InventoryEditModal from "./InventoryEditModal";
import StockActions from "./StockActions";
import RoleGuard from "@/components/auth/RoleGuard";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sort?: string;
    order?: "asc" | "desc";
    name?: string;
    categoryId?: string;
  }>;
}

interface InventoryResponse {
  data: Inventory[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function getInventories(
  params: Record<string, string | undefined>,
): Promise<InventoryResponse> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/inventories?${query.toString()}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch inventories");
  }

  const result = await res.json();
  return result.data;
}

export default async function InventoriesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const { data: inventories, meta } = await getInventories(resolvedParams);

  const currentPage = meta.page;
  const totalPages = meta.totalPages;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">All Inventories</h1>

      <RoleGuard allowed={["ADMIN"]}>
        <InventoryActions type="create" />
      </RoleGuard>

      {/* filter & sort */}
      <form method="GET" className="flex flex-wrap gap-4 mb-6 items-center">
        {/* Search */}
        <input
          name="name"
          placeholder="Search name..."
          defaultValue={resolvedParams.name || ""}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded"
        />

        {/* sort field */}
        <select
          name="sort"
          defaultValue={resolvedParams.sort || "id"}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded"
        >
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="stock">Sort by Stock</option>
          <option value="category">Sort by Category</option>
        </select>

        {/* sort order */}
        <select
          name="order"
          defaultValue={resolvedParams.order || "asc"}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        {/* reset page to 1 when filtering */}
        <input type="hidden" name="page" value="1" />

        <button
          type="submit"
          className="px-4 py-2 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-md text-sm hover:from-blue-600 hover:to-indigo-700 transition duration-200 ease-in-out shadow-md"
        >
          Apply
        </button>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {inventories.map((item) => (
          <Card key={item.id} className="relative">
            <RoleGuard allowed={["ADMIN"]}>
              <InventoryEditModal
                id={item.id}
                defaultData={{
                  name: item.name,
                  description: item.description,
                  categoryId: item.categoryId,
                }}
              />
            </RoleGuard>

            <h3 className="text-lg font-semibold mb-2">{item.name}</h3>

            <p className="text-sm text-gray-400">
              Description: {item.description}
            </p>

            <p className="text-sm text-gray-400">Stock: {item.stock}</p>

            <p className="text-sm text-blue-400">
              Category: {item.category?.name}
            </p>

            <Link
              href={`/inventories/${item.id}`}
              className="text-xs text-gray-500 mt-2 block hover:text-blue-400 transition"
            >
              View Details →
            </Link>

            <RoleGuard allowed={["ADMIN"]}>
              <InventoryActions type="delete" id={item.id} />
            </RoleGuard>

            <RoleGuard allowed={["ADMIN"]}>
              <StockActions inventoryId={item.id} />
            </RoleGuard>
          </Card>
        ))}
      </div>

      {/* pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        {currentPage > 1 && (
          <Link
            href={{
              pathname: "/inventories",
              query: { ...resolvedParams, page: currentPage - 1 },
            }}
            className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition"
          >
            Previou
          </Link>
        )}

        <span className="text-gray-400">
          Page {currentPage} of {totalPages}
        </span>

        {currentPage < totalPages && (
          <Link
            href={{
              pathname: "/inventories",
              query: { ...resolvedParams, page: currentPage + 1 },
            }}
            className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
