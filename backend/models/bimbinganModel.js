import db from "../db.js";
export const createBimbingan = (data) => {
    return new Promise((resolve, reject) => {
        const {
            mahasiswa_id,
            pengajuan_id,
            mahasiswa,
            dosen,
            topik,
            catatan,
            tanggal,
            status = "pending"
        } = data;

        db.query(
            `INSERT INTO bimbingan
            (mahasiswa_id, pengajuan_id, mahasiswa, dosen, topik, catatan, tanggal, status)
            VALUES (?,?,?,?,?,?,?,?)`,
            [
                mahasiswa_id,
                pengajuan_id,
                mahasiswa,
                dosen,
                topik,
                catatan,
                tanggal,
                status
            ],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};

export const updateBimbingan = (id, feedback, status) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE bimbingan SET feedback=?, status=? WHERE id=?`,
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

export const getAllBimbingan = () => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM bimbingan ORDER BY id DESC",
            (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(rows);
            }
        );
    });
};

export const getBimbinganWithDosen = () => {
    return new Promise((resolve, reject) => {
        db.query(`
      SELECT b.*, p.pembimbing1, p.pembimbing2
      FROM bimbingan b
      LEFT JOIN pembimbing p ON b.mahasiswa_id = p.mahasiswa_id
      ORDER BY b.id DESC
    `, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};