import express from "express";
import { addPenguji } from "../controllers/pengujiController.js";

const router = express.Router();

router.post("/", addPenguji);

export default router;