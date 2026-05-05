import db from "../db.js";

// GET
export const getAllSidang = () => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM sidang ORDER BY tanggal DESC",
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};

// CREATE
export const createSidang = (data) => {
    return new Promise((resolve, reject) => {
        const {
            mahasiswa,
            judul,
            tanggal,
            penguji,
            nilai,
            status,
            revisi
        } = data;

        db.query(
            `INSERT INTO sidang 
      (mahasiswa, judul, tanggal, penguji, nilai, status, revisi)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                mahasiswa,
                judul,
                tanggal,
                penguji,
                nilai,
                status,
                revisi
            ],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};

// UPDATE
export const updateSidang = (id, data) => {
    return new Promise((resolve, reject) => {
        const {
            mahasiswa,
            judul,
            tanggal,
            penguji,
            nilai,
            status,
            revisi
        } = data;

        db.query(
            `UPDATE sidang SET
      mahasiswa=?,
      judul=?,
      tanggal=?,
      penguji=?,
      nilai=?,
      status=?,
      revisi=?
      WHERE id=?`,
            [
                mahasiswa,
                judul,
                tanggal,
                penguji,
                nilai,
                status,
                revisi,
                id
            ],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};

// DELETE
export const deleteSidang = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            "DELETE FROM sidang WHERE id=?",
            [id],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};