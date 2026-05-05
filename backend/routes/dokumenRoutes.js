import express from "express";
import multer from "multer";

import {
    getDokumen,
    uploadDokumen,
    updateDokumenStatus
} from "../controllers/dokumenController.js";

const router = express.Router();

// =====================
// MULTER
// =====================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + "-" + file.originalname
        );
    }
});

const upload = multer({ storage });

// =====================
// ROUTES
// =====================

router.get("/", getDokumen);

router.post(
    "/",
    upload.single("file"),
    uploadDokumen
);

router.put("/:id", updateDokumenStatus);

export default router;