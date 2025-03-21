import { Router } from "express";
import { router as cardsRouter } from "./cards-router.js";
import { router as fieldsRouter } from "./fields-router.js";

// import { router as authRouter } from "./authRouter.js";

export const router = Router();

router.use("/api", cardsRouter);
router.use("/api", fieldsRouter);
// router.use("/api", authRouter);
