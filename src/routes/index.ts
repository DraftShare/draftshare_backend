import { Router } from "express";
import { router as wordsRouter } from "./wordsRouter.js";
import { router as authRouter } from "./authRouter.js";

export const router = Router();

router.use("/api", wordsRouter);
router.use("/api", authRouter);
