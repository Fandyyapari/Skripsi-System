import express from "express";

import {
    getBimbingan,
    addBimbingan,
    editBimbingan,
    removeBimbingan
} from "../controllers/bimbinganController.js";

const router = express.Router();

router.get("/", getBimbingan);

router.post("/", addBimbingan);

router.put("/:id", editBimbingan);

router.delete("/:id", removeBimbingan);

export default router;