import { Request, Response } from "express";
import response from "../utils/response";
import { createAdminService } from "../services/adminService";

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await createAdminService(email, password);

    return response.success(res, admin, "Admin created successfully", 201);
  } catch (err: any) {
    return response.error(res, err.message);
  }
};
