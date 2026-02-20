"use client";

import { useState } from "react";
import { getToken } from "@/src/lib/auth";

interface Props {
  inventoryId: number;
}

export default function StockActions({ inventoryId }: Props) {
  const [amount, setAmount] = useState("");
  const token = getToken();

  const handleStock = async (type: "INCREMENT" | "DECREMENT") => {
    if (!amount || Number(amount) <= 0) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stocks`, {
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

    setAmount("");
    window.location.reload();
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <input
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={() => handleStock("INCREMENT")}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold"
        >
          +
        </button>

        <button
          onClick={() => handleStock("DECREMENT")}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold"
        >
          −
        </button>
      </div>
    </div>
  );
}
