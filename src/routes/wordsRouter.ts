import { Router } from "express";
import wordsController from "../controllers/cards-controller/index.js";
import { addOne } from "../controllers/cards-controller/add-one.js";
import { updateOne } from "../controllers/cards-controller/update-one.js";
import { getAll } from "../controllers/cards-controller/get-all.js";
import { deleteMany } from "../controllers/cards-controller/delete.js";

export const router = Router();

router.get("/words", getAll);
router.post("/words", addOne);
router.patch("/words", updateOne);
router.delete("/words", deleteMany);
