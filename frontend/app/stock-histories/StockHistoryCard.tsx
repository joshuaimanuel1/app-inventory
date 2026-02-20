import Card from "@/components/ui/Card";
import { StockHistory } from "@/src/lib/types/stockHistory";

export default function StockHistoryCard({ item }: { item: StockHistory }) {
  const isIncrement = item.type === "INCREMENT";

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-2">{item.inventory.name}</h3>

      <div className="flex items-center gap-2 mb-2">
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            isIncrement
              ? "bg-green-600/20 text-green-400"
              : "bg-red-600/20 text-red-400"
          }`}
        >
          {isIncrement ? "Stock In" : "Stock Out"}
        </span>
      </div>

      <p className="text-sm text-gray-400">Amount: {item.amount}</p>

      <p className="text-sm text-gray-400">
        Current Stock: {item.inventory.stock}
      </p>

      <p className="text-xs text-gray-500 mt-2">
        {new Date(item.date).toLocaleString()}
      </p>
    </Card>
  );
}
