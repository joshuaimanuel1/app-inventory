const prisma = require("../config/prisma");
const response = require("../utils/response");

//POST /api/stocks
exports.updateStock = async (req, res) => {
  try {
    const { inventoryId, amount, type } = req.body;

    const inventory = await prisma.inventory.findUnique({
      where: {
        id: inventoryId,
      },
    });

    if (!inventory) {
      return response.error(res, "Inventory not found", 404);
    }

    let newStock = inventory.stock;

    if (type === "INCREMENT") {
      newStock += amount;
    }

    if (type === "DECREMENT") {
      if (inventory.stock < amount) {
        return response.error(res, "Stock insufficient", 400);
      }

      newStock -= amount;
    }

    const [updatedInventory, stockHistory] = await prisma.$transaction([
      prisma.inventory.update({
        where: { id: inventoryId },

        data: {
          stock: newStock,
        },
      }),

      prisma.stockHistory.create({
        data: {
          inventoryId,
          amount,
          type,
        },
      }),
    ]);

    return response.success(
      res,
      {
        inventory: updatedInventory,
        history: stockHistory,
      },
      "Stock updated successfully",
    );
  } catch (err) {
    return response.error(res, err.message);
  }
};

//api/stock-histories
exports.getAllStockHistory = async (req, res) => {
  try {
    const histories = await prisma.stockHistory.findMany({
      include: {
        inventory: {
          select: {
            id: true,
            name: true,
            stock: true,
          },
        },
      },

      orderBy: {
        date: "desc",
      },
    });

    return response.success(res, histories);
  } catch (err) {
    return response.error(res, err.message);
  }
};

//GET /api/stock-histories/:inventoryId
exports.getStockHistoryByInventoryId = async (req, res) => {
  try {
    const inventoryId = parseInt(req.params.inventoryId);

    const histories = await prisma.stockHistory.findMany({
      where: {
        inventoryId,
      },

      include: {
        inventory: {
          select: {
            id: true,
            name: true,
            stock: true,
          },
        },
      },

      orderBy: {
        date: "desc",
      },
    });

    return response.success(res, histories);
  } catch (err) {
    return response.error(res, err.message);
  }
};
