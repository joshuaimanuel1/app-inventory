-- DropForeignKey
ALTER TABLE "StockHistory" DROP CONSTRAINT "StockHistory_inventoryId_fkey";

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
