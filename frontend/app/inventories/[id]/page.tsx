import { notFound } from "next/navigation";
import { InventoryDetail } from "@/src/lib/types/inventory";
import Card from "@/components/ui/Card";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

async function getInventory(id: string): Promise<InventoryDetail> {
  if (!id || isNaN(Number(id))) {
    notFound();
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/inventories/${id}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return notFound();
  }

  const result = await res.json();

  if (!result?.data) {
    return notFound();
  }

  return result.data;
}

export default async function InventoryDetailPage({ params }: Props) {
  const { id } = await params;

  const inventory = await getInventory(id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Inventory Detail</h1>

      <Card>
        <h2 className="text-xl font-semibold mb-3">{inventory.name}</h2>

        <p className="text-gray-400 mb-2">
          Description: {inventory.description}
        </p>

        <p className="text-gray-400 mb-2">Stock: {inventory.stock}</p>

        <p className="text-blue-400 mb-6">
          Category: {inventory.category?.name}
        </p>

        <h3 className="text-lg font-semibold mb-4">Stock History</h3>

        <div className="space-y-2">
          {inventory.histories?.length ? (
            inventory.histories.map((history) => (
              <div
                key={history.id}
                className="bg-gray-800 p-3 rounded text-sm flex justify-between items-center"
              >
                <span
                  className={
                    history.type === "INCREMENT"
                      ? "text-green-400 font-semibold"
                      : "text-red-400 font-semibold"
                  }
                >
                  {history.type}
                </span>

                <span className="text-gray-300">{history.amount} pcs</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No stock history yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
