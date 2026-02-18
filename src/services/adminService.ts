import { Role } from "@prisma/client";
import { createUser, findUserByEmail } from "../repositories/userRepository";
import { hashPassword } from "../utils/hash";

export const createAdminService = async (email: string, password: string) => {
  const existing = await findUserByEmail(email);

  if (existing) {
    throw new Error("Email already exists");
  }

  const hashed = await hashPassword(password);

  return createUser(email, hashed, Role.ADMIN);
};
