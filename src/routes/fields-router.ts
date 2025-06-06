import { Router } from "express";
import { getAll } from "../controllers/fields-controller/get-all.js";
import { create } from "../controllers/fields-controller/create.js";
import { deleteMany } from "../controllers/fields-controller/delete.js";
import { update } from "../controllers/fields-controller/update.js";
import { upsertAndDelete } from "../controllers/fields-controller/upsert-and-delete.js";

export const router = Router();

router.get("/fields", getAll);
router.post("/fields", upsertAndDelete);
router.patch("/fields", update);
router.delete("/fields", deleteMany);
