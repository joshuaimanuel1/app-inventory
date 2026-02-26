"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Inventory {
  id: number;
  name: string;
}

export default function StockHistoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "";
  const currentInventoryId = searchParams.get("inventoryId") || "";

  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [inventoryId, setInventoryId] = useState(currentInventoryId);

  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || "",
  );

  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  //fetch inventory
  useEffect(() => {
    fetchInventories();
  }, []);

  async function fetchInventories() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/inventories?limit=1000`,
        { cache: "no-store" },
      );

      const result = await res.json();

      const inventoryArray = result?.data?.data;

      if (Array.isArray(inventoryArray)) {
        setInventories(inventoryArray);
      } else {
        console.error("Inventory data is not array:", result);
        setInventories([]);
      }
    } catch (err) {
      console.error("Failed fetch inventories:", err);
      setInventories([]);
    }
  }

  function handleTypeChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set("type", value);
    else params.delete("type");

    params.set("page", "1");

    router.push(`/stock-histories?${params.toString()}`);
  }

  //apply filter
  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    if (inventoryId) params.set("inventoryId", inventoryId);
    else params.delete("inventoryId");

    if (startDate) params.set("startDate", startDate);
    else params.delete("startDate");

    if (endDate) params.set("endDate", endDate);
    else params.delete("endDate");

    params.set("page", "1");

    router.push(`/stock-histories?${params.toString()}`);
  }

  const filterOptions = [
    { label: "All History", value: "" },
    { label: "Stock In (+)", value: "INCREMENT" },
    { label: "Stock Out (-)", value: "DECREMENT" },
  ];

  return (
    <div className="flex flex-col gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
      {/* TYPE FILTER */}
      <div className="inline-flex items-center gap-1 bg-gray-950 p-1.5 rounded-lg border border-gray-800 self-start">
        {filterOptions.map((option) => {
          const isActive = currentType === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleTypeChange(option.value)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* other filters */}
      <div className="flex flex-wrap items-end gap-4">
        {/* invnetory select */}
        <div className="space-y-1">
          <Label>Inventory</Label>

          <Select value={inventoryId} onValueChange={setInventoryId}>
            <SelectTrigger className="w-55">
              <SelectValue placeholder="Select inventory" />
            </SelectTrigger>

            <SelectContent>
              {inventories.map((inv) => (
                <SelectItem key={inv.id} value={String(inv.id)}>
                  {inv.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* start date */}
        <div className="space-y-1">
          <Label>Start Date</Label>

          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* end date */}
        <div className="space-y-1">
          <Label>End Date</Label>

          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* apply button */}
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
}
