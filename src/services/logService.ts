import {
  createLogRepository,
  getAllLogsRepository,
} from "../repositories/logRepository";

export const createLogService = async (action: string, userId: number) => {
  try {
    await createLogRepository(action, userId);
  } catch (error) {
    console.error("Log service error:", error);
  }
};

export const getAllLogsService = async () => {
  return getAllLogsRepository();
};
