import { Router } from "express";
import wordsController from "../controllers/wordsController.js";

export const router = Router();

router.get("/words", wordsController.getAll);
router.post("/words", wordsController.addOne);
