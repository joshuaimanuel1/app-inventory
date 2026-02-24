import prisma from "../config/prisma";

export const createLogRepository = async (action: string, userId: number) => {
  return prisma.log.create({
    data: {
      action,
      userId,
    },
  });
};

export const getAllLogsRepository = async () => {
  return prisma.log.findMany({
    include: {
      user: {
        select: {
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
