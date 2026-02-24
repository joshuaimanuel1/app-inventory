import { Response } from "express";
import prisma from "../config/prisma";
import response from "../utils/response";
import { createAdminService } from "../services/adminService";
import { AuthRequest } from "../middlewares/authMiddleware";
import bcrypt from "bcrypt";

//create admmin
export const createAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return response.error(res, "Email and password are required", 400);
    }

    const admin = await createAdminService(email, password);

    return response.success(res, admin, "Admin created successfully", 201);
  } catch (err: any) {
    return response.error(res, err.message);
  }
};

//get all user
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return response.success(res, users);
  } catch (err: any) {
    return response.error(res, err.message);
  }
};

//update user email
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { email } = req.body;

    if (!email) {
      return response.error(res, "Email is required", 400);
    }

    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return response.error(res, "User not found", 404);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { email },
    });

    return response.success(res, updated, "User updated successfully");
  } catch (err: any) {
    return response.error(res, err.message);
  }
};

//update password
export const updateUserPassword = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { password } = req.body;

    if (!password || password.length < 6) {
      return response.error(res, "Password minimum 6 characters", 400);
    }

    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return response.error(res, "User not found", 404);
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashed },
    });

    return response.success(res, null, "Password updated successfully");
  } catch (err: any) {
    return response.error(res, err.message);
  }
};

//delete user
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return response.error(res, "User not found", 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    return response.success(res, null, "User deleted successfully");
  } catch (err: any) {
    return response.error(res, err.message);
  }
};
