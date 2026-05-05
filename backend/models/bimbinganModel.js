import db from "../db.js";

export const getAllBimbingan = () => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM bimbingan ORDER BY id DESC",
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};

export const createBimbingan = (data) => {
    return new Promise((resolve, reject) => {
        const {
            mahasiswa_id,
            mahasiswa,
            dosen,
            topik,
            catatan,
            tanggal
        } = data;

        db.query(
            `INSERT INTO bimbingan
      (mahasiswa_id, mahasiswa, dosen, topik, catatan, tanggal)
      VALUES (?,?,?,?,?,?)`,
            [
                mahasiswa_id,
                mahasiswa,
                dosen,
                topik,
                catatan,
                tanggal
            ],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};

export const updateBimbingan = (
    id,
    feedback,
    status
) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE bimbingan
       SET feedback=?, status=?
       WHERE id=?`,
            [feedback, status, id],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};

export const deleteBimbingan = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            "DELETE FROM bimbingan WHERE id=?",
            [id],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};