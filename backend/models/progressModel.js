import db from "../db.js";

// GET ALL
export const getAllProgress = () => {
    return new Promise((resolve, reject) => {
        const sql = `
      SELECT 
        p.*,
        u.nama,
        u.identitas AS nim
      FROM progress p
      JOIN users u ON p.mahasiswa_id = u.id
      ORDER BY p.tanggal DESC
    `;

        db.query(sql, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

// ADD
export const createProgress = (data) => {
    return new Promise((resolve, reject) => {
        const {
            mahasiswa_id,
            judul,
            dospem,
            progress,
            status,
            tanggal
        } = data;

        db.query(
            `INSERT INTO progress 
       (mahasiswa_id, judul, dospem, progress, status, tanggal)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [mahasiswa_id, judul, dospem, progress, status, tanggal],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};

// UPDATE (umum)
export const updateProgressModel = (id, progress, status) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE progress SET progress=?, status=? WHERE id=?",
            [progress, status, id],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};

// VERIFIKASI (INI YANG DIPAKAI TOMBOL ACC/REVISI)
export const verifyProgressModel = (id, status_verifikasi, catatan) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE progress 
       SET status_verifikasi=?, catatan=? 
       WHERE id=?`,
            [status_verifikasi, catatan, id],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};

// DELETE
export const deleteProgressModel = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            "DELETE FROM progress WHERE id=?",
            [id],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};