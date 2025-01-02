import { Router } from "express";
import { router as wordsRouter } from "./wordsRouter.js";

export const router = Router();

router.use("/api", wordsRouter);

