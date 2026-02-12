const prisma = require("../config/prisma");
const response = require("../utils/response");

//GET /api/categories
exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        category: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return response.success(res, inventory);
  } catch (err) {
    return response.error(res, err.message);
  }
};

//GET /api/categories/:id
exports.getInventoryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: {
        category: true,
        histories: true,
      },
    });

    if (!inventory) {
      return response.error(res, "Inventory not found", 404);
    }

    return response.success(res, inventory);
  } catch (err) {
    return response.error(res, err.message);
  }
};

//POST /api/categories
exports.createInventory = async (req, res) => {
  try {
    const { name, description, categoryId, initialStock } = req.body;

    if (!name || !categoryId) {
      return response.error(res, "name and categoryId are required", 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.create({
        data: {
          name,
          description,
          categoryId,
          stock: initialStock || 0,
        },
      });

      if (initialStock && initialStock > 0) {
        await tx.stockHistory.create({
          data: {
            inventoryId: inventory.id,
            amount: initialStock,
            type: "INCREMENT",
          },
        });
      }

      return inventory;
    });

    return response.success(res, result, "Inventory created", 201);
  } catch (err) {
    return response.error(res, err.message);
  }
};

//PUT /api/categories/:id
exports.updateInventory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { name, description, categoryId } = req.body;

    const inventory = await prisma.inventory.update({
      where: { id },
      data: {
        name,
        description,
        categoryId,
      },
    });

    return response.success(res, inventory, "Inventory updated successfully");
  } catch (err) {
    return response.error(res, err.message);
  }
};

//DELETE /api/categories/:id
exports.deleteInventory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.inventory.delete({
      where: { id },
    });

    return response.success(res, null, "Inventory deleted successfully");
  } catch (err) {
    return response.error(res, err.message);
  }
};
