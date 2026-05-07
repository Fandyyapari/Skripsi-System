import db from "../db.js";

export const createPenguji = (data) => {
    return new Promise((resolve, reject) => {
        const { pengajuan_id, penguji1, penguji2 } = data;

        db.query(
            `INSERT INTO penguji (pengajuan_id, penguji1, penguji2)
       VALUES (?,?,?)`,
            [pengajuan_id, penguji1, penguji2],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};

export const getPenguji = () => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT p.*, pg.judul, pg.mahasiswa
       FROM penguji p
       JOIN pengajuan pg ON p.pengajuan_id = pg.id`,
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};