"use client";

import { useState } from "react";
import { getToken } from "@/src/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  inventoryId: number;
}

export default function StockActions({ inventoryId }: Props) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const token = getToken();
  const router = useRouter();

  const handleStock = async (type: "INCREMENT" | "DECREMENT") => {
    //validasi input
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stocks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          inventoryId,
          amount: Number(amount),
          type,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update stock");
      }

      toast.success(
        `Stock ${type === "INCREMENT" ? "added" : "reduced"} successfully`,
      );

      setAmount("");

      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
        Quick Adjust
      </p>

      <div className="flex items-center bg-gray-900/50 border border-gray-700 rounded-md overflow-hidden transition-colors focus-within:border-blue-500">
        <button
          onClick={() => handleStock("DECREMENT")}
          disabled={loading || !amount}
          className="px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors font-bold text-lg disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
          aria-label="Decrease stock"
        >
          −
        </button>

        <input
          type="number"
          min="1"
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-transparent text-center px-2 py-2 text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button
          onClick={() => handleStock("INCREMENT")}
          disabled={loading || !amount}
          className="px-4 py-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors font-bold text-lg disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
          aria-label="Increase stock"
        >
          +
        </button>
      </div>
    </div>
  );
}
