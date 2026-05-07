import db from "../db.js";

export const setPembimbing = (data) => {
    return new Promise((resolve, reject) => {
        const { pengajuan_id, dosen1, dosen2 } = data;

        db.query(
            `INSERT INTO pembimbing (pengajuan_id, dosen1, dosen2)
       VALUES (?,?,?)`,
            [pengajuan_id, dosen1, dosen2],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};

export const getPembimbing = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM pembimbing", (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};