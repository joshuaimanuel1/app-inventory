import { Request, Response } from "express";
import prisma from "../config/prisma";
import response from "../utils/response";

///GET /api/inventories
export const getAllInventory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    //pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //sorting
    const sortField = (req.query.sort as string) || "id";
    const sortOrder = (req.query.order as "asc" | "desc") || "asc";

    //filtering
    const nameFilter = req.query.name as string | undefined;
    const categoryFilter = req.query.category as string | undefined;

    //build where clause
    const where: any = {};

    if (nameFilter) {
      where.name = {
        contains: nameFilter,
        mode: "insensitive",
      };
    }

    if (categoryFilter) {
      where.category = {
        name: {
          contains: categoryFilter,
          mode: "insensitive",
        },
      };
    }

    //fetch data
    const inventories = await prisma.inventory.findMany({
      where,
      include: {
        category: true,
      },
      orderBy:
        sortField === "category"
          ? {
              category: {
                name: sortOrder,
              },
            }
          : {
              [sortField]: sortOrder,
            },
      skip,
      take: limit,
    });

    //total count
    const total = await prisma.inventory.count({ where });

    return response.success(res, {
      data: inventories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    return response.error(res, err.message);
  }
};

//GET /api/inventories/:id
export const getInventoryById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return response.error(res, "Invalid inventory ID", 400);
    }

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
  } catch (err: any) {
    return response.error(res, err.message);
  }
};

//POST /api/inventories
export const createInventory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { name, description, categoryId, initialStock } = req.body;

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
  } catch (err: any) {
    return response.error(res, err.message);
  }
};

//PUT /api/inventories/:id
export const updateInventory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return response.error(res, "Invalid inventory ID", 400);
    }

    const { name, description, categoryId } = req.body;

    const existing = await prisma.inventory.findUnique({
      where: { id },
    });

    if (!existing) {
      return response.error(res, "Inventory not found", 404);
    }

    const inventory = await prisma.inventory.update({
      where: { id },
      data: {
        name,
        description,
        categoryId,
      },
    });

    return response.success(res, inventory, "Inventory updated successfully");
  } catch (err: any) {
    return response.error(res, err.message);
  }
};

//DELETE /api/inventories/:id
export const deleteInventory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return response.error(res, "Invalid inventory ID", 400);
    }

    const existing = await prisma.inventory.findUnique({
      where: { id },
    });

    if (!existing) {
      return response.error(res, "Inventory not found", 404);
    }

    await prisma.inventory.delete({
      where: { id },
    });

    return response.success(res, null, "Inventory deleted successfully");
  } catch (err: any) {
    return response.error(res, err.message);
  }
};
