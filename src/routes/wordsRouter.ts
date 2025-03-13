import { Router } from "express";
import wordsController from "../controllers/cards-controller/index.js";
import { addOne } from "../controllers/cards-controller/add-one.js";
import { updateOne } from "../controllers/cards-controller/update-one.js";

export const router = Router();

router.get("/words", wordsController.getAll);
router.post("/words", addOne);
router.patch("/words", updateOne);
router.delete("/words", wordsController.delete);
