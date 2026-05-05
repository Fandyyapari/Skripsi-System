import db from "../db.js";

export const getAllPengajuan = () => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM pengajuan ORDER BY id DESC",
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};

export const createPengajuan = (data) => {
    return new Promise((resolve, reject) => {
        const {
            mahasiswa_id,
            judul,
            deskripsi,
            status,
            tanggal
        } = data;

        db.query(
            "SELECT * FROM pengajuan WHERE judul = ?",
            [judul],
            (err, rows) => {
                if (err) return reject(err);

                if (rows.length > 0) {
                    return reject(
                        new Error("Judul sudah digunakan")
                    );
                }

                db.query(
                    `INSERT INTO pengajuan
          (mahasiswa_id, judul, deskripsi, status, tanggal)
          VALUES (?,?,?,?,?)`,
                    [
                        mahasiswa_id,
                        judul,
                        deskripsi,
                        status,
                        tanggal
                    ],
                    (err) => {
                        if (err) reject(err);
                        resolve();
                    }
                );
            }
        );
    });
};

export const updateStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE pengajuan SET status=? WHERE id=?",
            [status, id],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};

export const deletePengajuan = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            "DELETE FROM pengajuan WHERE id=?",
            [id],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};