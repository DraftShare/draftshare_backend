import { Router } from "express";
import AuthController from "../controllers/authController.js";

export const router = Router();

router.post("/auth/telegram", AuthController.authTelegram);
