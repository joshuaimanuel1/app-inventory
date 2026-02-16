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
    return response.error(res, err.message);
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
    return response.error(res, err.message);
  }
};

//POST /api/categories
export const createCategory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { name } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return response.success(res, category, "Category created", 201);
  } catch (err: any) {
    return response.error(res, err.message);
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

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return response.error(res, "Category not found", 404);
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return response.success(res, category, "Category updated successfully");
  } catch (err: any) {
    return response.error(res, err.message);
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

    await prisma.category.delete({
      where: { id },
    });

    return response.success(res, null, "Category deleted");
  } catch (err: any) {
    return response.error(res, err.message);
  }
};
