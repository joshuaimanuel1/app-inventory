// import { Request, Response } from "express";
// import prisma from "../config/prisma";
// import response from "../utils/response";

// ///GET /api/inventories
// export const getAllInventory = async (
//   req: Request,
//   res: Response,
// ): Promise<Response> => {
//   try {
//     //pagination
//     const page = Math.max(Number(req.query.page) || 1, 1);
//     const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
//     const skip = (page - 1) * limit;

//     //sorting
//     const allowedSortFields = ["id", "name", "stock", "createdAt", "category"];

//     const requestedSort = req.query.sort as string;

//     const sortField = allowedSortFields.includes(requestedSort)
//       ? requestedSort
//       : "id";

//     const sortOrder =
//       req.query.order === "desc" || req.query.order === "asc"
//         ? (req.query.order as "asc" | "desc")
//         : "asc";

//     //filtering
//     const nameFilter = req.query.name as string | undefined;
//     const categoryIdFilter = req.query.categoryId as string | undefined;

//     const where: any = {};

//     if (nameFilter) {
//       where.name = {
//         contains: nameFilter,
//         mode: "insensitive",
//       };
//     }

//     if (categoryIdFilter && !isNaN(Number(categoryIdFilter))) {
//       where.categoryId = Number(categoryIdFilter);
//     }

//     let orderBy: any;

//     if (sortField === "category") {
//       orderBy = [
//         {
//           category: {
//             name: sortOrder,
//           },
//         },
//         { id: "asc" }, // secondary sort for stability
//       ];
//     } else {
//       orderBy = [
//         { [sortField]: sortOrder },
//         { id: "asc" }, // secondary sort
//       ];
//     }

//     //fetch data
//     const inventories = await prisma.inventory.findMany({
//       where,
//       include: {
//         category: true,
//       },
//       orderBy,
//       skip,
//       take: limit,
//     });

//     //total count
//     const total = await prisma.inventory.count({ where });

//     return response.success(res, {
//       data: inventories,
//       meta: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err: any) {
//     return response.error(res, err.message);
//   }
// };

// //GET /api/inventories/:id
// export const getInventoryById = async (
//   req: Request,
//   res: Response,
// ): Promise<Response> => {
//   try {
//     const id = Number(req.params.id);

//     if (isNaN(id)) {
//       return response.error(res, "Invalid inventory ID", 400);
//     }

//     const inventory = await prisma.inventory.findUnique({
//       where: { id },
//       include: {
//         category: true,
//         histories: true,
//       },
//     });

//     if (!inventory) {
//       return response.error(res, "Inventory not found", 404);
//     }

//     return response.success(res, inventory);
//   } catch (err: any) {
//     return response.error(res, err.message);
//   }
// };

// //POST /api/inventories
// export const createInventory = async (
//   req: Request,
//   res: Response,
// ): Promise<Response> => {
//   try {
//     const { name, description, categoryId, initialStock } = req.body;

//     const inventory = await prisma.inventory.create({
//       data: {
//         name,
//         description,
//         categoryId,
//         stock: initialStock || 0,

//         histories:
//           initialStock && initialStock > 0
//             ? {
//                 create: {
//                   amount: initialStock,
//                   type: "INCREMENT",
//                 },
//               }
//             : undefined,
//       },

//       include: {
//         category: true,
//         histories: true,
//       },
//     });

//     return response.success(
//       res,
//       inventory,
//       "Inventory created successfully",
//       201,
//     );
//   } catch (err: any) {
//     return response.error(res, err.message);
//   }
// };

// //PUT /api/inventories/:id
// export const updateInventory = async (
//   req: Request,
//   res: Response,
// ): Promise<Response> => {
//   try {
//     const id = Number(req.params.id);

//     if (isNaN(id)) {
//       return response.error(res, "Invalid inventory ID", 400);
//     }

//     const { name, description, categoryId } = req.body;

//     const existing = await prisma.inventory.findUnique({
//       where: { id },
//     });

//     if (!existing) {
//       return response.error(res, "Inventory not found", 404);
//     }

//     const inventory = await prisma.inventory.update({
//       where: { id },
//       data: {
//         name,
//         description,
//         categoryId,
//       },
//     });

//     return response.success(res, inventory, "Inventory updated successfully");
//   } catch (err: any) {
//     return response.error(res, err.message);
//   }
// };

// //DELETE /api/inventories/:id
// export const deleteInventory = async (
//   req: Request,
//   res: Response,
// ): Promise<Response> => {
//   try {
//     const id = Number(req.params.id);

//     if (isNaN(id)) {
//       return response.error(res, "Invalid inventory ID", 400);
//     }

//     const existing = await prisma.inventory.findUnique({
//       where: { id },
//     });

//     if (!existing) {
//       return response.error(res, "Inventory not found", 404);
//     }

//     await prisma.inventory.delete({
//       where: { id },
//     });

//     return response.success(res, null, "Inventory deleted successfully");
//   } catch (err: any) {
//     return response.error(res, err.message);
//   }
// };
import { Request, Response } from "express";
import prisma from "../config/prisma";
import response from "../utils/response";

//GET /api/inventories
export const getAllInventory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    //pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    //sorting
    const allowedSortFields = ["id", "name", "stock", "createdAt", "category"];

    const requestedSort = req.query.sort as string;

    const sortField = allowedSortFields.includes(requestedSort)
      ? requestedSort
      : "id";

    const sortOrder =
      req.query.order === "desc" || req.query.order === "asc"
        ? (req.query.order as "asc" | "desc")
        : "asc";

    //filtering
    const nameFilter = req.query.name as string | undefined;
    const categoryIdFilter = req.query.categoryId as string | undefined;

    const where: any = {};

    if (nameFilter) {
      where.name = {
        contains: nameFilter,
        mode: "insensitive",
      };
    }

    if (categoryIdFilter && !isNaN(Number(categoryIdFilter))) {
      where.categoryId = Number(categoryIdFilter);
    }

    let orderBy: any;

    if (sortField === "category") {
      orderBy = [
        {
          category: {
            name: sortOrder,
          },
        },
        { id: "asc" }, // secondary sort for stability
      ];
    } else {
      orderBy = [
        { [sortField]: sortOrder },
        { id: "asc" }, // secondary sort
      ];
    }

    //fetch data
    const inventories = await prisma.inventory.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
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
    return response.error(res, err.message, 500);
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
    return response.error(res, err.message, 500);
  }
};

//POST /api/inventories
export const createInventory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { name, description, categoryId, initialStock } = req.body;

    //validasi nama tidak boleh kosong
    if (!name || name.trim() === "") {
      return response.error(res, "Inventory name is required", 400);
    }

    //validasi categoryId harus ada
    if (!categoryId) {
      return response.error(res, "Category ID is required", 400);
    }

    //cek duplikasi nama inventory (case-insensitive)
    const existingInventory = await prisma.inventory.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existingInventory) {
      return response.error(
        res,
        `Inventory item '${name.trim()}' already exists`,
        409,
      );
    }

    const inventory = await prisma.inventory.create({
      data: {
        name: name.trim(), //pastikan nama di-trim
        description,
        categoryId,
        stock: initialStock || 0,

        histories:
          initialStock && initialStock > 0
            ? {
                create: {
                  amount: initialStock,
                  type: "INCREMENT",
                },
              }
            : undefined,
      },

      include: {
        category: true,
        histories: true,
      },
    });

    return response.success(
      res,
      inventory,
      "Inventory created successfully",
      201,
    );
  } catch (err: any) {
    return response.error(res, err.message, 500);
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

    //validasi nama tidak boleh kosong
    if (!name || name.trim() === "") {
      return response.error(res, "Inventory name is required", 400);
    }

    const existing = await prisma.inventory.findUnique({
      where: { id },
    });

    if (!existing) {
      return response.error(res, "Inventory not found", 404);
    }

    //cek konflik nama dengan inventory LAIN
    const nameConflict = await prisma.inventory.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
        id: {
          not: id, // Abaikan ID dari barang yang sedang di-update
        },
      },
    });

    if (nameConflict) {
      return response.error(
        res,
        `Another item with name '${name.trim()}' already exists`,
        409,
      );
    }

    const inventory = await prisma.inventory.update({
      where: { id },
      data: {
        name: name.trim(),
        description,
        categoryId,
      },
    });

    return response.success(res, inventory, "Inventory updated successfully");
  } catch (err: any) {
    return response.error(res, err.message, 500);
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
    return response.error(res, err.message, 500);
  }
};
