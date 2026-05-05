import db from "../db.js";

export const getDashboard = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM users WHERE role='mahasiswa') AS mahasiswa,
      (SELECT COUNT(*) FROM users WHERE role='dosen') AS dosen,
      (SELECT COUNT(*) FROM users WHERE role='admin') AS admin,
      (SELECT COUNT(*) FROM users WHERE role='kaprodi') AS kaprodi,

      (SELECT COUNT(*) FROM jadwal) AS totalJadwal,

      (SELECT COUNT(*) FROM progress) AS totalProgress,
      (SELECT AVG(progress) FROM progress) AS avgProgress,

      (SELECT COUNT(*) FROM progress WHERE status='baru') AS baru,
      (SELECT COUNT(*) FROM progress WHERE status='awal') AS awal,
      (SELECT COUNT(*) FROM progress WHERE status='berjalan') AS berjalan,
      (SELECT COUNT(*) FROM progress WHERE status='selesai') AS selesai
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.json(rows[0]);
  });
};