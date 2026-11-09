import { Router } from "express";
import { getMemos, createMemo, editMemo, removeMemo } from "../controllers/memoController.js";

const router = Router();

router.get("/", getMemos);
router.post("/", createMemo);
router.put("/:id", editMemo);
router.delete("/:id", removeMemo);

export default router;