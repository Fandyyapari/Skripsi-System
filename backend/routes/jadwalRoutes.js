import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

import {
  getJadwal,
  addJadwal,
  editJadwal,
  removeJadwal
} from "../controllers/jadwalController.js";

const router = express.Router();

// 🔥 ROLE SYSTEM

// Semua role boleh lihat
router.get("/", verifyToken, allowRoles("admin", "dosen", "mahasiswa"), getJadwal);

// Hanya admin boleh tambah
router.post("/", verifyToken, allowRoles("admin"), addJadwal);

// Hanya admin boleh edit
router.put("/:id", verifyToken, allowRoles("admin"), editJadwal);

// Hanya admin boleh hapus
router.delete("/:id", verifyToken, allowRoles("admin"), removeJadwal);

export default router;