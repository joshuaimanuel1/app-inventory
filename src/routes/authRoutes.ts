import { Router } from "express";
import { register, login, refreshToken } from "../controllers/authController";

const router = Router();

// register
router.post("/register", register);

// login
router.post("/login", login);

// refresh token ← INI YANG PENTING
router.post("/refresh", refreshToken);

export default router;
