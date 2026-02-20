import { Inventory } from "@/src/lib/types/inventory";
import Card from "@/components/ui/Card";
import Link from "next/link";
import InventoryActions from "./InventoryActions";
import StockActions from "./StockActions";
import RoleGuard from "@/components/auth/RoleGuard";

interface Props {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sort?: string;
    order?: "asc" | "desc";
    name?: string;
    categoryId?: string;
  }>;
}

async function getInventories(params: Record<string, string | undefined>) {
  const cleanParams: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value) cleanParams[key] = value;
  }

  const query = new URLSearchParams(cleanParams).toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/inventories?${query}`,
    { cache: "no-store" },
  );

  const result = await res.json();
  return result.data;
}

export default async function InventoriesPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const { data } = await getInventories(resolvedParams);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">All Inventories</h1>

      {/* admin create only */}
      <RoleGuard allowed={["ADMIN"]}>
        <InventoryActions type="create" />
      </RoleGuard>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {data.map((item: Inventory) => (
          <Card key={item.id}>
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
              className="text-xs text-gray-500 mt-2 block"
            >
              View Details →
            </Link>

            {/* admin delete only */}
            <RoleGuard allowed={["ADMIN"]}>
              <InventoryActions type="delete" id={item.id} />
            </RoleGuard>

            {/* admin stock add only */}
            <RoleGuard allowed={["ADMIN"]}>
              <StockActions inventoryId={item.id} />
            </RoleGuard>
          </Card>
        ))}
      </div>
    </div>
  );
}
