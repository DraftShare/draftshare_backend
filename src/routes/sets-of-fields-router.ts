import { Router } from "express";
import { getAll } from "../controllers/sets-of-fields-controller/get-all.js";
import { upsert } from "../controllers/sets-of-fields-controller/upsert.js";
import { deleteMany } from "../controllers/sets-of-fields-controller/delete.js";
import { getById } from "../controllers/sets-of-fields-controller/get-by-id.js";

export const router = Router();

router.get("/sets-of-fields", getAll);
router.get("/sets-of-fields/:id", getById);
router.post("/sets-of-fields", upsert);
router.delete("/sets-of-fields", deleteMany);
