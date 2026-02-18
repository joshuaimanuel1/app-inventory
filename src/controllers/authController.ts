import { Request, Response } from "express";

import response from "../utils/response";

import {
  registerService,
  loginService,
  refreshTokenService,
} from "../services/authService";

//REGISTER USER
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await registerService(email, password);

    return response.success(res, user, "User registered", 201);
  } catch (err: any) {
    return response.error(res, err.message);
  }
};

//LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const tokens = await loginService(email, password);

    return response.success(res, tokens, "Login success");
  } catch (err: any) {
    return response.error(res, err.message, 401);
  }
};

//REFRESH TOKEN
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const tokens = await refreshTokenService(refreshToken);

    return response.success(res, tokens, "Token refreshed");
  } catch (err: any) {
    return response.error(res, err.message, 401);
  }
};
