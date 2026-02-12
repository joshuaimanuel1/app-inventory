const prisma = require("../config/prisma");
const response = require("../utils/response");

//GET /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return response.success(res, categories);
  } catch (err) {
    return response.error(res, err.message);
  }
};

//GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return response.error(res, "Category not found", 404);
    }

    return response.success(res, category);
  } catch (err) {
    return response.error(res, err.message);
  }
};

//POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return response.error(res, "Category name is required", 400);
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return response.success(res, category, "Category created", 201);
  } catch (err) {
    return response.error(res, err.message);
  }
};

//PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { name } = req.body;

    if (!name) {
      return response.error(res, "Category name is required", 400);
    }

    const category = await prisma.category.update({
      where: { id },

      data: {
        name,
      },
    });

    return response.success(res, category, "Category updated successfully");
  } catch (err) {
    return response.error(res, err.message);
  }
};

//DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.category.delete({
      where: { id },
    });

    return response.success(res, null, "Category deleted");
  } catch (err) {
    return response.error(res, err.message);
  }
};
