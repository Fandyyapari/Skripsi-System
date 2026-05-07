import express from "express";
import { addPembimbing, getAllPembimbing } from "../controllers/pembimbingController.js";

const router = express.Router();

router.get("/", getAllPembimbing);
router.post("/", addPembimbing);

export default router;