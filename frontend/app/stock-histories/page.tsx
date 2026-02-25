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

interface Response {
  data: StockHistory[];
  meta: {
    page: number;
    totalPages: number;
  };
}

async function getStockHistories(
  params: Record<string, string | undefined>,
): Promise<Response> {
  const cleanParams: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value) cleanParams[key] = value;
  });

  const query = new URLSearchParams(cleanParams).toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stock-histories?${query}`,
    { cache: "no-store" },
  );

  const result = await res.json();

  return result.data;
}

export default async function StockHistoriesPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;

  const { data, meta } = await getStockHistories(resolvedParams);

  function buildPageLink(page: number) {
    const params = new URLSearchParams(
      resolvedParams as Record<string, string>,
    );

    params.set("page", String(page));

    return `/stock-histories?${params.toString()}`;
  }

  return (
    <div>
      {/* title */}
      <h1 className="text-3xl font-bold mb-8">Stock Histories</h1>

      {/* filter */}
      <div className="mb-8">
        <StockHistoryFilter />
      </div>

      {/* list */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length === 0 && (
          <p className="text-gray-500">No stock history found</p>
        )}

        {data.map((item) => (
          <Card key={item.id}>
            <h3 className="text-lg font-semibold mb-2">
              {item.inventory?.name ?? "Unknown Item"}
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
        ))}
      </div>

      {/* pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          {meta.page > 1 ? (
            <Link
              href={buildPageLink(meta.page - 1)}
              className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
            >
              Previous
            </Link>
          ) : (
            <button
              disabled
              className="px-4 py-2 bg-gray-800 rounded opacity-40"
            >
              Previous
            </button>
          )}

          <span className="text-gray-400">
            Page {meta.page} of {meta.totalPages}
          </span>

          {meta.page < meta.totalPages ? (
            <Link
              href={buildPageLink(meta.page + 1)}
              className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
            >
              Next
            </Link>
          ) : (
            <button
              disabled
              className="px-4 py-2 bg-gray-800 rounded opacity-40"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}
