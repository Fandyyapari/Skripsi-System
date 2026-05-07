import db from "../db.js";

// =====================
// GET ALL
// =====================
export const getAllPengajuan = () => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT p.*, u.username AS mahasiswa
       FROM pengajuan p
       JOIN users u ON p.mahasiswa_id = u.id
       ORDER BY p.id DESC`,
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};


// GET ALL PENGAJUAN
export const getPengajuan = (req, res) => {
    db.query(
        `SELECT p.*, u.nama 
         FROM pengajuan p
         JOIN users u ON p.mahasiswa_id = u.id
         ORDER BY p.id DESC`,
        (err, rows) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(rows);
        }
    );
};

// =====================
// CREATE
// =====================
export const createPengajuan = (req, res) => {
    const { mahasiswa_id, judul, deskripsi } = req.body;

    if (!mahasiswa_id || !judul) {
        return res.status(400).json({
            message: "Data tidak lengkap"
        });
    }

    db.query(
        "SELECT * FROM pengajuan WHERE judul=?",
        [judul],
        (err, rows) => {

            if (err)
                return res.status(500).json({
                    message: err.message
                });

            if (rows.length > 0) {
                return res.status(400).json({
                    message: "Judul sudah digunakan"
                });
            }

            db.query(
                `INSERT INTO pengajuan 
                (mahasiswa_id, judul, deskripsi) 
                VALUES (?, ?, ?)`,
                [mahasiswa_id, judul, deskripsi],
                (err) => {

                    if (err)
                        return res.status(500).json({
                            message: err.message
                        });

                    res.json({
                        message: "Pengajuan berhasil dikirim"
                    });
                }
            );
        }
    );
};

// =====================
// UPDATE STATUS
// =====================
export const updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.query(
        "UPDATE pengajuan SET status=? WHERE id=?",
        [status, id],
        (err) => {
            if (err) return res.status(500).json({ message: err.message });

            res.json({ message: "Status berhasil diupdate" });
        }
    );
};

export const deletePengajuan = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM pengajuan WHERE id=?",
        [id],
        (err) => {
            if (err)
                return res.status(500).json({
                    message: err.message
                });

            res.json({
                message: "Pengajuan berhasil dihapus"
            });
        }
    );
};