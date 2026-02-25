import { Request, Response } from "express";
import prisma from "../config/prisma";
import response from "../utils/response";

//GET /api/categories
export const getAllCategories = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return response.success(res, categories);
  } catch (err: any) {
    return response.error(res, err.message, 500);
  }
};

//GET /api/categories/:id
export const getCategoryById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return response.error(res, "Invalid category ID", 400);
    }

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return response.error(res, "Category not found", 404);
    }

    return response.success(res, category);
  } catch (err: any) {
    return response.error(res, err.message, 500);
  }
};

//POST /api/categories
export const createCategory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { name } = req.body;

    //validasi input tidak boleh kosong
    if (!name || name.trim() === "") {
      return response.error(res, "Category name is required", 400);
    }

    //cek duplikasi dengan case-insensitive
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });

    //jika sudah ada, kasih info error 409 (Conflict) atau 400 (Bad Request)
    if (existingCategory) {
      return response.error(
        res,
        `Category '${name.trim()}' already exists`,
        409,
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
      },
    });

    return response.success(res, category, "Category created", 201);
  } catch (err: any) {
    return response.error(res, err.message, 500);
  }
};

//PUT /api/categories/:id
export const updateCategory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (isNaN(id)) {
      return response.error(res, "Invalid category ID", 400);
    }

    //validasi input tidak boleh kosong
    if (!name || name.trim() === "") {
      return response.error(res, "Category name is required", 400);
    }

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return response.error(res, "Category not found", 404);
    }

    //cek apakah nama baru bertabrakan dengan kategori LAIN
    const nameConflict = await prisma.category.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
        id: {
          not: id,
        },
      },
    });

    if (nameConflict) {
      return response.error(
        res,
        `Category '${name.trim()}' already exists`,
        409,
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });

    return response.success(res, category, "Category updated successfully");
  } catch (err: any) {
    return response.error(res, err.message, 500);
  }
};

//DELETE /api/categories/:id
export const deleteCategory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return response.error(res, "Invalid category ID", 400);
    }

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return response.error(res, "Category not found", 404);
    }

    //cek apakah kategori ini masih dipakai di tabel Inventory
    const linkedInventory = await prisma.inventory.findFirst({
      where: {
        categoryId: id,
      },
    });

    //jika masih ada barang yang pakai kategori ini, tolak proses delete-nya!
    if (linkedInventory) {
      return response.error(
        res,
        "Cannot delete category because it is still used by some inventories.",
        409,
      );
    }

    //jika aman (tidak ada inventory yang terhubung), baru boleh dihapus
    await prisma.category.delete({
      where: { id },
    });

    return response.success(res, null, "Category deleted successfully");
  } catch (err: any) {
    //fallback jika ada error server lainnya
    return response.error(res, "Internal server error occurred", 500);
  }
};
