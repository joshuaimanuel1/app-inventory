"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useState } from "react";

export default function StockHistoryFilter() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "";

  const [inventoryId, setInventoryId] = useState(
    searchParams.get("inventoryId") || "",
  );

  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || "",
  );

  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const handleTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set("type", value);
    else params.delete("type");

    params.set("page", "1");

    router.push(`/stock-histories?${params.toString()}`);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (inventoryId) params.set("inventoryId", inventoryId);
    else params.delete("inventoryId");

    if (startDate) params.set("startDate", startDate);
    else params.delete("startDate");

    if (endDate) params.set("endDate", endDate);
    else params.delete("endDate");

    params.set("page", "1");

    router.push(`/stock-histories?${params.toString()}`);
  };

  const filterOptions = [
    { label: "All History", value: "" },

    { label: "Stock In (+)", value: "INCREMENT" },

    { label: "Stock Out (-)", value: "DECREMENT" },
  ];

  return (
    <div className="flex flex-col gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
      {/* filter type */}

      <div className="inline-flex items-center gap-1 bg-gray-950 p-1.5 rounded-lg border border-gray-800 self-start">
        {filterOptions.map((option) => {
          const isActive = currentType === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleTypeChange(option.value)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* flter lainnya (date range & inventoryId */}

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Inventory ID
          </label>

          <input
            type="number"
            placeholder="e.g. 5"
            value={inventoryId}
            onChange={(e) => setInventoryId(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-300 mb-1 font-medium tracking-wide">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 scheme-dark transition-colors cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-300 mb-1 font-medium tracking-wide">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 scheme-dark transition-colors cursor-pointer"
          />
        </div>

        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-md text-sm hover:from-blue-600 hover:to-indigo-700 transition duration-200 ease-in-out shadow-md"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
