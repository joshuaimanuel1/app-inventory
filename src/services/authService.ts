import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

import {
  findUserByEmail,
  findUserById,
  createUser,
  saveRefreshToken,
} from "../repositories/userRepository";

// REGISTER USER
export const registerService = async (email: string, password: string) => {
  const existing = await findUserByEmail(email);

  if (existing) {
    throw new Error("Email already exists");
  }

  const hashed = await hashPassword(password);

  return createUser(email, hashed, Role.USER);
};

// LOGIN USER / ADMIN (same function)
export const loginService = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await saveRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
  };
};

// REFRESH TOKEN
export const refreshTokenService = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;

    const user = await findUserById(decoded.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  } catch {
    throw new Error("Invalid refresh token");
  }
};
