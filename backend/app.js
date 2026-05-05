import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import pengajuanRoutes from "./routes/pengajuanRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import dokumenRoutes from "./routes/dokumenRoutes.js";
import bimbinganRoutes from "./routes/bimbinganRoutes.js";
import sidangRoutes from "./routes/sidangRoutes.js";
import multer from "multer";
import path from "path";





dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/pengajuan", pengajuanRoutes);
app.use("/progress", progressRoutes);
app.use("/bimbingan", bimbinganRoutes);
app.use("/sidang", sidangRoutes);
app.use("/dokumen", dokumenRoutes);

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    message: "Upload berhasil",
    file: req.file.filename
  });
});

app.listen(5000, () => {
  console.log("Server jalan di port 5000");
});

