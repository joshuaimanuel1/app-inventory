import { Request, Response } from "express";
import prisma from "../config/prisma";
import response from "../utils/response";

///Helper function
const buildDateFilter = (
  startDate?: string,
  endDate?: string,
): { gte?: Date; lte?: Date } | undefined => {
  if (!startDate && !endDate) return undefined;

  const filter: { gte?: Date; lte?: Date } = {};

  if (startDate) {
    filter.gte = new Date(startDate);
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    filter.lte = end;
  }

  return filter;
};

//POST /api/stocks
export const updateStock = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { inventoryId, amount, type } = req.body;

    if (!inventoryId || !amount || !type) {
      return response.error(res, "Missing required fields", 400);
    }

    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
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
        data: { stock: newStock },
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
  } catch (err: any) {
    return response.error(res, err.message);
  }
};

//GET /api/stock-histories
export const getAllStockHistory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const sortField = (req.query.sort as string) || "date";
    const sortOrder = (req.query.order as "asc" | "desc") || "desc";

    const inventoryId = req.query.inventoryId
      ? Number(req.query.inventoryId)
      : undefined;

    const type = req.query.type as string | undefined;

    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    //pagination
    const skip = (page - 1) * limit;

    //filtering
    const where: any = {};

    //filter inventoryId
    if (inventoryId) {
      where.inventoryId = inventoryId;
    }

    //filter type
    if (type) {
      where.type = type;
    }

    //filter date range
    const dateFilter = buildDateFilter(startDate, endDate);

    if (dateFilter) {
      where.date = dateFilter;
    }

    //query data
    const histories = await prisma.stockHistory.findMany({
      where,

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
        [sortField]: sortOrder,
      },

      skip,
      take: limit,
    });

    //total count for pagination
    const total = await prisma.stockHistory.count({
      where,
    });

    //response
    return response.success(res, {
      data: histories,

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

//GET /api/stock-histories/:inventoryId
export const getStockHistoryByInventoryId = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const inventoryId = Number(req.params.inventoryId);

    if (isNaN(inventoryId)) {
      return response.error(res, "Invalid inventory ID", 400);
    }

    const histories = await prisma.stockHistory.findMany({
      where: { inventoryId },

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
  } catch (err: any) {
    return response.error(res, err.message);
  }
};
