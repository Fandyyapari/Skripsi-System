const db = require("../db");
const bcrypt = require("bcryptjs");

exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username=?", [username], async (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (result.length === 0) {
      return res.json({ message: "User tidak ditemukan" });
    }

    const user = result[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.json({ message: "Password salah" });
    }

    res.json({ message: "Login berhasil", user });
  });
};