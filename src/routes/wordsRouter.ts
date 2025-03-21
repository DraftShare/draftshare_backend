import { Router } from "express";
import { addOne } from "../controllers/cards-controller/add-one.js";
import { deleteMany } from "../controllers/cards-controller/delete.js";
import { getAll } from "../controllers/cards-controller/get-all.js";
import { update } from "../controllers/cards-controller/update.js";

export const router = Router();

router.get("/words", getAll);
router.post("/words", addOne);
router.patch("/words", update);
router.delete("/words", deleteMany);
