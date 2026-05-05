import express from "express";
import {
    getPengajuan,
    createPengajuan,
    updateStatus,
    deletePengajuan
} from "../controllers/pengajuanController.js";

const router = express.Router();

router.get("/", getPengajuan);
router.post("/", createPengajuan);
router.put("/:id", updateStatus);
router.delete("/:id", deletePengajuan);

export default router;