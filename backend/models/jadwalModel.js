import db from "../db.js";

export const getAllJadwal = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM jadwal ORDER BY tanggal, jam_mulai", (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const createJadwal = (data) => {
  return new Promise((resolve, reject) => {
    const { mahasiswa, tanggal, jam_mulai, jam_selesai } = data;

    db.query("SELECT * FROM jadwal WHERE tanggal = ?", [tanggal], (err, rows) => {
      if (err) return reject(err);

      const bentrok = rows.some(j =>
        jam_mulai < j.jam_selesai &&
        jam_selesai > j.jam_mulai
      );

      if (bentrok) return reject(new Error("❌ Jadwal bentrok!"));

      db.query(
        "INSERT INTO jadwal (mahasiswa, tanggal, jam_mulai, jam_selesai) VALUES (?,?,?,?)",
        [mahasiswa, tanggal, jam_mulai, jam_selesai],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  });
};

export const updateJadwal = (id, data) => {
  return new Promise((resolve, reject) => {
    const { mahasiswa, tanggal, jam_mulai, jam_selesai } = data;

    db.query(
      "SELECT * FROM jadwal WHERE tanggal = ? AND id != ?",
      [tanggal, id],
      (err, rows) => {
        if (err) return reject(err);

        const bentrok = rows.some(j =>
          jam_mulai < j.jam_selesai &&
          jam_selesai > j.jam_mulai
        );

        if (bentrok) return reject(new Error("❌ Jadwal bentrok!"));

        db.query(
          "UPDATE jadwal SET mahasiswa=?, tanggal=?, jam_mulai=?, jam_selesai=? WHERE id=?",
          [mahasiswa, tanggal, jam_mulai, jam_selesai, id],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      }
    );
  });
};

export const deleteJadwal = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM jadwal WHERE id = ?", [id], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};