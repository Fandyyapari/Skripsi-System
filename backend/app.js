require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3001" // React port
}));
app.use(express.json());

// Homepage
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 API Jadwal FULLSTACK",
    endpoints: {
      "GET /jadwal": "List semua jadwal",
      "POST /jadwal": "Buat jadwal baru", 
      "DELETE /jadwal/:id": "Hapus jadwal"
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", db: "Connected" });
});

// ========================================
// ✅ ROUTE CRUD LENGKAP
// ========================================

// GET /jadwal - List semua (React butuh ini)
app.get("/jadwal", (req, res) => {
  db.query("SELECT * FROM jadwal ORDER BY tanggal, jam_mulai", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows); // ARRAY!
  });
});
// POST /jadwal - Create + Cek Bentrok (React butuh ini)
app.post("/jadwal", (req, res) => {
  const { mahasiswa, tanggal, jam_mulai, jam_selesai } = req.body;

  // Validasi
  if (!mahasiswa || !tanggal || !jam_mulai || !jam_selesai) {
    return res.status(400).json({ message: "Semua field wajib!" });
  }

  // Cek bentrok
  db.query("SELECT * FROM jadwal WHERE tanggal = ?", [tanggal], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const bentrok = rows.some(j =>
      jam_mulai < j.jam_selesai && 
      jam_selesai > j.jam_mulai
    );

    if (bentrok) {
      return res.status(409).json({ message: "❌ Jadwal bentrok!" });
    }

    // Insert
    db.query(
      "INSERT INTO jadwal (mahasiswa, tanggal, jam_mulai, jam_selesai) VALUES (?,?,?,?)",
      [mahasiswa, tanggal, jam_mulai, jam_selesai],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "✅ Jadwal berhasil!" });
      }
    );
  });
});

// DELETE /jadwal/:id (React butuh ini)
app.delete("/jadwal/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM jadwal WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Jadwal tidak ditemukan" });
    }
    res.json({ message: "✅ Jadwal dihapus!" });
  });
});

app.listen(3000, () => {
  console.log("🌐 Server: http://localhost:3000");
  console.log("✅ Routes ready: GET/POST/DELETE /jadwal");
});