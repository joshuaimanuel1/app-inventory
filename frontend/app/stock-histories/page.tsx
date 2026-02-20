import { StockHistory } from "@/src/lib/types/stockHistory";
import Card from "@/components/ui/Card";
import StockHistoryFilter from "./StockHistoryFilter";
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    type?: string;
    inventoryId?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

async function getStockHistories(params: Record<string, string | undefined>) {
  const cleanParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      cleanParams[key] = value;
    }
  }

  const query = new URLSearchParams(cleanParams).toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/stock-histories?${query}`;

  const res = await fetch(url, { cache: "no-store" });
  const result = await res.json();

  return result.data;
}

export default async function StockHistoriesPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const { data, meta } = await getStockHistories(resolvedParams);

  const buildPageLink = (newPage: number) => {
    const params = new URLSearchParams(resolvedParams as any);
    params.set("page", newPage.toString());
    return `?${params.toString()}`;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Stock Histories</h1>

      {/* filter */}
      <div className="mb-8">
        <StockHistoryFilter />
      </div>

      {/* data */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data && data.length > 0 ? (
          data.map((item: StockHistory) => (
            <Card key={item.id}>
              <h3 className="text-lg font-semibold mb-2">
                {item.inventory?.name || "Unknown Item"}
              </h3>
              <p className="text-sm text-gray-400">Type: {item.type}</p>
              <p className="text-sm text-gray-400">Amount: {item.amount}</p>
              <p className="text-sm text-blue-400">
                Stock Now: {item.inventory?.stock ?? 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(item.date).toLocaleString()}
              </p>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">Tidak ada histori stok.</p>
        )}
      </div>

      {/* pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex gap-4 mt-8">
          {meta.page > 1 && (
            <Link
              href={buildPageLink(meta.page - 1)}
              className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition"
            >
              Previous
            </Link>
          )}

          {meta.page < meta.totalPages && (
            <Link
              href={buildPageLink(meta.page + 1)}
              className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
