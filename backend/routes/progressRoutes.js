import express from "express";

import {
    getProgress,
    addProgress,
    updateProgress,
    deleteProgress
} from "../controllers/progressController.js";

const router = express.Router();

router.get("/", getProgress);

router.post("/", addProgress);

router.put("/:id", updateProgress);

router.delete("/:id", deleteProgress);

export default router;