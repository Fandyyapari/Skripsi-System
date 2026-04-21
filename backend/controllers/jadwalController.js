const db = require("../db");

exports.getJadwal = (req, res) => {
  db.query("SELECT * FROM jadwal", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
};

exports.tambahJadwal = (req, res) => {
  const { mahasiswa, tanggal, jam_mulai, jam_selesai } = req.body;

  db.query("SELECT * FROM jadwal", (err, rows) => {
    let bentrok = rows.some(j =>
      j.tanggal == tanggal &&
      jam_mulai < j.jam_selesai &&
      jam_selesai > j.jam_mulai
    );

    if (bentrok) {
      return res.json({ message: "Jadwal bentrok!" });
    }

    db.query(
      "INSERT INTO jadwal VALUES (NULL,?,?,?,?)",
      [mahasiswa, tanggal, jam_mulai, jam_selesai],
      () => res.json({ message: "Berhasil!" })
    );
  });
};