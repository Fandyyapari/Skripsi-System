import express from "express";

import {
    getSidang,
    addSidang,
    editSidang,
    removeSidang
} from "../controllers/sidangController.js";

const router = express.Router();

router.get("/", getSidang);

router.post("/", addSidang);

router.put("/:id", editSidang);

router.delete("/:id", removeSidang);

export default router;