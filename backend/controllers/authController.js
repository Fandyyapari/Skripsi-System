import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// LOGIN
export const login = (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });

      if (rows.length === 0)
        return res.status(401).json({ message: "User tidak ditemukan" });

      const user = rows[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match)
        return res.status(401).json({ message: "Password salah" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          nama: user.nama,
          username: user.username,
          role: user.role
        }
      });
    }
  );
};

// REGISTER
export const register = async (req, res) => {
  const {
    nama,
    username,
    email,
    password,
    role,
    identitas
  } = req.body;

  if (!nama || !username || !email || !password || !role || !identitas) {
    return res.status(400).json({
      message: "Data belum lengkap"
    });
  }

  const hash = await bcrypt.hash(password, 10);

  db.query(
    `INSERT INTO users 
    (nama, username, email, password, role, identitas)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [nama, username, email, hash, role, identitas],
    (err) => {
      if (err)
        return res.status(500).json({
          message: err.message
        });

      res.json({
        message: "User berhasil ditambahkan"
      });
    }
  );
};

// GET USERS
export const getUsers = (req, res) => {
  db.query(
    "SELECT id,nama,username,email,role,identitas,status FROM users",
    (err, rows) => {
      if (err)
        return res.status(500).json({
          message: err.message
        });

      res.json(rows);
    }
  );
};