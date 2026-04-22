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

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
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

exports.updateJadwal = (req, res) => {
  const id = req.params.id;
  const { mahasiswa, tanggal, jam_mulai, jam_selesai } = req.body;

  db.query(
    "UPDATE jadwal SET mahasiswa=?, tanggal=?, jam_mulai=?, jam_selesai=? WHERE id=?",
    [mahasiswa, tanggal, jam_mulai, jam_selesai, id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Error update data" });
      }
      res.json({ message: "Berhasil diupdate!" });
    }
  );
};

exports.deleteJadwal = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM jadwal WHERE id=?", [id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error delete data" });
    }
    res.json({ message: "Berhasil dihapus!" });
  });
};