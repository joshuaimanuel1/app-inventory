import { Inventory } from "@/src/lib/types/inventory";
import Card from "@/components/ui/Card";
import Link from "next/link";

import InventoryCreateModal from "./InventoryCreateModal";
import InventoryEditModal from "./InventoryEditModal";
import InventoryActions from "./InventoryActions";
import StockActions from "./StockActions";

import RoleGuard from "@/components/auth/RoleGuard";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

//fetch inventories
async function getInventories(
  params: Record<string, string | undefined>,
): Promise<InventoryResponse> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/inventories?${query.toString()}`,
    {
      cache: "no-store",
    },
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

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(
      resolvedParams as Record<string, string>,
    );
    params.set("page", pageNumber.toString());
    return `/inventories?${params.toString()}`;
  };

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
      {/* header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Inventories</h1>

        <RoleGuard allowed={["ADMIN"]}>
          <InventoryCreateModal />
        </RoleGuard>
      </div>

      {/* filter & sort */}
      <form method="GET" className="flex flex-wrap gap-4 mb-6 items-center">
        {/* search */}
        <input
          name="name"
          placeholder="Search name..."
          defaultValue={resolvedParams.name || ""}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-500"
        />

        {/* sort field */}
        <select
          name="sort"
          defaultValue={resolvedParams.sort || "id"}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
        >
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="stock">Sort by Stock</option>
          <option value="category">Sort by Category</option>
        </select>

        {/* order */}
        <select
          name="order"
          defaultValue={resolvedParams.order || "asc"}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        {/* reset page */}
        <input type="hidden" name="page" value="1" />

        {/* apply button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-sm transition-colors duration-200"
        >
          Apply
        </button>
      </form>

      {/* inventory grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventories.map((item) => (
          <Card
            key={item.id}
            className="relative group p-6 flex flex-col h-full"
          >
            <RoleGuard allowed={["ADMIN"]}>
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <InventoryEditModal
                  id={item.id}
                  defaultData={{
                    name: item.name,
                    description: item.description,
                    categoryId: item.categoryId,
                  }}
                />
                <InventoryActions type="delete" id={item.id} />
              </div>
            </RoleGuard>

            {/* Konten Utama */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2 pr-16">{item.name}</h3>

              <p className="text-sm text-gray-400 mb-1">
                <span className="font-medium text-gray-300">Description:</span>{" "}
                {item.description}
              </p>

              <p className="text-sm text-gray-400 mb-1">
                <span className="font-medium text-gray-300">Stock:</span>{" "}
                {item.stock}
              </p>

              <p className="text-sm text-blue-400 mb-3">
                <span className="font-medium text-gray-300">Category:</span>{" "}
                {item.category?.name}
              </p>

              <Link
                href={`/inventories/${item.id}`}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
              >
                View Details <span>&rarr;</span>
              </Link>
            </div>

            {/* stock action */}
            <RoleGuard allowed={["ADMIN"]}>
              <div className="mt-6 pt-4 border-t border-gray-800">
                <StockActions inventoryId={item.id} />
              </div>
            </RoleGuard>
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
                  href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
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
                      href={createPageURL(page)}
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
                      ? createPageURL(currentPage + 1)
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
