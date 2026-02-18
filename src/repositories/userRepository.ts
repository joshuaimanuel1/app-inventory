import prisma from "../config/prisma";
import { Role } from "@prisma/client";

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = (email: string, password: string, role: Role) => {
  return prisma.user.create({
    data: {
      email,
      password,
      role,
    },
  });
};

export const saveRefreshToken = (id: number, token: string) => {
  return prisma.user.update({
    where: { id },
    data: { refreshToken: token },
  });
};
