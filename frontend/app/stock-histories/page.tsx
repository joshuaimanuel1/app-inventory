import { StockHistory } from "@/src/lib/types/stockHistory";
import Card from "@/components/ui/Card";
import StockHistoryFilter from "./StockHistoryFilter";
import Link from "next/link";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

  const currentPage = meta.page;
  const totalPages = meta.totalPages;

  function buildPageLink(page: number | string) {
    const params = new URLSearchParams(
      resolvedParams as Record<string, string>,
    );

    params.set("page", String(page));

    return `/stock-histories?${params.toString()}`;
  }

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

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
          <Card key={item.id} className="p-6 flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-3">
              {item.inventory?.name ?? "Unknown Item"}
            </h3>

            <div className="flex-1 space-y-1.5">
              <p className="text-sm text-gray-400">
                <span className="font-medium text-gray-300">Type:</span>{" "}
                <span
                  className={
                    item.type === "INCREMENT" ? "text-blue-400" : "text-red-400"
                  }
                >
                  {item.type}
                </span>
              </p>

              <p className="text-sm text-gray-400">
                <span className="font-medium text-gray-300">Amount:</span>{" "}
                {item.amount}
              </p>

              <p className="text-sm text-indigo-400">
                <span className="font-medium text-gray-300">Stock Now:</span>{" "}
                {item.inventory?.stock ?? 0}
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-800">
              {new Date(item.date).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      {totalPages > 0 && (
        <div className="mt-10 mb-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href={currentPage > 1 ? buildPageLink(currentPage - 1) : "#"}
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* Page Numbers & Ellipsis */}
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href={buildPageLink(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href={
                    currentPage < totalPages
                      ? buildPageLink(currentPage + 1)
                      : "#"
                  }
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
